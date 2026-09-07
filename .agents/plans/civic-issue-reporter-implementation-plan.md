# Civic Issue Reporter - Implementation Plan

## Project Overview
**Project**: Viber (Supabase project)  
**Tech Stack**: Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Supabase  
**Deployment**: Vercel  

---

## Phase 1: Project Setup
1. Initialize Next.js 15 project with TypeScript, Tailwind, ESLint, App Router
2. Install dependencies: `@supabase/ssr`, `@supabase/supabase-js`, `lucide-react`
3. Initialize shadcn/ui and install components: button, input, textarea, select, card, badge, table, toast, dialog, avatar, dropdown-menu, skeleton, label, separator, scroll-area
4. Configure `.env.local` with Supabase credentials from "Viber" project
5. Create Supabase clients:
   - `lib/supabase/client.ts` - browser client
   - `lib/supabase/server.ts` - server client
6. Create TypeScript types in `types/index.ts` (Profile, Issue, Category, Status)
7. Create utility functions in `lib/utils.ts` (cn helper)
8. Set up base layout, globals.css with design system CSS variables
9. Create landing page (`app/page.tsx`)

---

## Phase 2: Database Schema & RLS
Run in Supabase SQL Editor:

### Tables
```sql
-- profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  role text check (role in ('citizen', 'admin')) default 'citizen',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- issues table
create table issues (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  category text check (category in ('pothole', 'garbage', 'streetlight', 'water', 'other')) not null,
  status text check (status in ('pending', 'in_progress', 'resolved')) default 'pending',
  image_url text,
  location text,
  reported_by uuid references profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
```

### RLS Policies
```sql
alter table profiles enable row level security;
alter table issues enable row level security;

-- Profiles policies
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles" on profiles for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Issues policies
create policy "Citizens can view own issues" on issues for select using (reported_by = auth.uid());
create policy "Citizens can insert own issues" on issues for insert with check (reported_by = auth.uid());
create policy "Citizens can update own issues" on issues for update using (reported_by = auth.uid());
create policy "Admins can view all issues" on issues for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can update all issues" on issues for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
```

### Storage
```sql
insert into storage.buckets (id, name, public) values ('issue-images', 'issue-images', true);

create policy "Public read access" on storage.objects for select using (bucket_id = 'issue-images');
create policy "Authenticated upload" on storage.objects for insert with check (bucket_id = 'issue-images' and auth.role() = 'authenticated');
create policy "Users can update own uploads" on storage.objects for update using (bucket_id = 'issue-images' and auth.uid() = owner);
create policy "Users can delete own uploads" on storage.objects for delete using (bucket_id = 'issue-images' and auth.uid() = owner);
```

### Triggers
```sql
-- Auto-create profile on signup
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', coalesce(new.raw_user_meta_data->>'role', 'citizen'));
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Updated_at trigger
create function public.handle_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end $$;

create trigger set_updated_at on issues before update for each row execute procedure public.handle_updated_at();
```

---

## Phase 3: Authentication & Role-Based Routing
1. **Middleware** (`middleware.ts`) - Route protection, role-based redirects
2. **Auth Actions** (`lib/actions/auth.ts`) - `login`, `register`, `logout` server actions
3. **Auth Layout** (`app/(auth)/layout.tsx`) - Centered card container
4. **Login Page** (`app/(auth)/login/page.tsx`) - Email/password form
5. **Register Page** (`app/(auth)/register/page.tsx`) - Name, email, password, role select (citizen default)
6. **Navbar** (`components/Navbar.tsx`) - Logo, user avatar/name, role badge, logout
7. **Citizen Layout** (`app/(citizen)/layout.tsx`) - Navbar + navigation
8. **Admin Layout** (`app/(admin)/layout.tsx`) - Navbar + admin navigation

---

## Phase 4: Citizen Features
1. **ReportForm** (`components/ReportForm.tsx`) - Client component with:
   - React Hook Form + Zod validation
   - Title, Description, Category select (pothole, garbage, streetlight, water, other)
   - Image upload with preview (drag-drop, max 5MB)
   - Location text input
   - Submit with loading state
2. **Report Page** (`app/(citizen)/report/page.tsx`) - Server component wrapping ReportForm
3. **Create Issue Action** (`lib/actions/issues.ts`) - Upload image → insert issue
4. **IssueCard** (`components/IssueCard.tsx`) - Title, category badge, status badge, date, thumbnail
5. **StatusBadge** (`components/StatusBadge.tsx`) - Color-coded pill (pending=amber, in_progress=blue, resolved=green)
6. **My Reports Page** (`app/(citizen)/my-reports/page.tsx`) - List of IssueCards, empty state

---

## Phase 5: Admin Features
1. **Admin Dashboard** (`app/(admin)/dashboard/page.tsx`):
   - Server component fetching all issues
   - Status filter (multi-select) + Category filter (multi-select)
   - Table: Image, Title, Category, Status, Reporter, Date, Actions
   - Pagination (20 per page)
2. **Issue Detail** (`app/(admin)/issues/[id]/page.tsx`):
   - Full details card
   - Full-size image
   - Status dropdown (sequential: pending → in_progress → resolved)
   - Update button with optimistic UI
3. **Admin Actions** (`lib/actions/admin.ts`) - `getAllIssues`, `updateIssueStatus`
4. **Status Transition Validation** - Server-side sequential check

---

## Phase 6: Polish & Verification
1. Add loading skeletons for all list pages
2. Add error boundaries + toast notifications (shadcn Toast)
3. Test RLS: citizen can't see other's issues, admin sees all
4. Test image upload + display
5. Test status transitions (sequential enforcement)
6. Responsive check: mobile (375px), tablet (768px), desktop (1440px)
7. Run `npm run build` and `npm run lint` - fix all errors
8. Full E2E test: register citizen → report → view → register admin → dashboard → update status

---

## File Structure
```
civic-reporter/
├── app/
│   ├── (auth)/login/page.tsx
│   ├── (auth)/register/page.tsx
│   ├── (citizen)/layout.tsx
│   ├── (citizen)/report/page.tsx
│   ├── (citizen)/my-reports/page.tsx
│   ├── (admin)/layout.tsx
│   ├── (admin)/dashboard/page.tsx
│   ├── (admin)/issues/[id]/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/ (shadcn components)
│   ├── Navbar.tsx
│   ├── ReportForm.tsx
│   ├── IssueCard.tsx
│   └── StatusBadge.tsx
├── lib/
│   ├── supabase/client.ts
│   ├── supabase/server.ts
│   ├── utils.ts
│   └── actions/
│       ├── auth.ts
│       ├── issues.ts
│       └── admin.ts
├── types/index.ts
├── middleware.ts
└── .env.local
```

---

## Key Decisions from Clarification
1. **Supabase Project**: "Viber" - already created
2. **Location**: Simple text field (no map picker)
3. **Image Limits**: Max 5MB, standard image types
4. **Admin Filters**: Status + Category multi-select filters included
5. **Status Transitions**: Sequential only (pending → in_progress → resolved)
6. **Auth**: Immediate login, no email verification