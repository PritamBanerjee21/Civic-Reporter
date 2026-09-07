# Civic Issue Reporter — Govt. of Jharkhand (SIH25031)

A crowdsourced civic-issue reporting platform. Citizens report problems like potholes, garbage, broken streetlights, and water leaks with a photo + location, then track progress from `pending → in_progress → resolved`. Admins triage all reports, filter/search, and update statuses.

> App source lives in [`civic-reporter/`](./civic-reporter). The root folder also contains `.agents/` (skills + implementation plan) and `AGENTS.md` (contributor rules).

## Features

### Public
- **Landing page (`/`)** — Hero, How-It-Works (Report → Review → Resolve), category grid, CTA to register/report.

### Auth (`/login`, `/register`)
- Email + password auth via Supabase Auth.
- Register collects `full_name` + role (`citizen` | `admin`), with client-side confirm-password and 8-char minimum checks.
- Supports `?message` (e.g. post-signup prompt) and `?redirect=` return URLs.
- Role-based redirects: citizens → `/home`, admins → `/dashboard`.

### Citizen
- **Home (`/home`)** — Role-aware landing: report counts by status, quick CTA, categories, 3 most recent reports, About section.
- **Report an Issue (`/report`)** — Validated form (`react-hook-form` + `zod`):
  - `title` (5–100 chars), `description` (20–1000 chars), `category` enum, `location` (optional, ≤200 chars)
  - Drag-and-drop image upload with preview, 5 MB max, JPEG/PNG/WebP only
  - Submits via `createIssue` Server Action; image goes to Supabase Storage, row goes to Postgres.
- **My Reports (`/my-reports`)** — Grid of the logged-in citizen's own issues (`IssueCard` with category color, image, location/date), plus empty state.

### Admin
- **Dashboard (`/dashboard`)** — 4 stat cards (total / pending / in-progress / resolved) + recent-5 table with View links.
- **All Issues (`/issues`)** — Search across title/description/location + status and category filters (`AdminIssuesList`).
- **Issue Detail (`/issues/[id]`)** — Full report card, image, reporter name/date, status stepper; status updates via `updateIssueStatus` with `useTransition`.

### Shared UI
- `Navbar` with role-aware links, avatar dropdown, role `Badge`, dark-mode `ThemeToggle`, logout.
- `StatusBadge` (`pending` = amber, `in_progress` = blue, `resolved` = emerald).
- shadcn/ui components, `next-themes` dark mode, `sonner` toasts, loading skeletons and error/empty states.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui + `lucide-react` |
| Backend | Supabase (Auth + PostgreSQL + Storage) |
| Data access | `@supabase/ssr` + `supabase-js`, Server Components by default, Server Actions for mutations |
| Forms | `react-hook-form` + `zod` + `@hookform/resolvers` |

Do not deviate per `AGENTS.md`: no ML, no paid services, no external APIs beyond Supabase.

## Project Structure

```
..\VIBE_CODING\
├── README.md                      # this file
├── AGENTS.md                      # contributor / agent rules
├── .agents/plans/                 # implementation plan
├── .agents/skills/                # frontend-design, shadcn-ui, supabase, …
└── civic-reporter/                # the Next.js app
    └── src/
        ├── app/
        │   ├── page.tsx                   # / landing
        │   ├── layout.tsx                 # root layout (fonts, Providers)
        │   ├── (auth)/login/page.tsx       # /login
        │   ├── (auth)/register/page.tsx    # /register
        │   ├── (home)/home/page.tsx        # /home (role-aware)
        │   ├── (citizen)/report/page.tsx   # /report
        │   ├── (citizen)/my-reports/page.tsx
        │   ├── (admin)/dashboard/page.tsx
        │   └── (admin)/issues/page.tsx + [id]/page.tsx
        ├── components/
        │   ├── Navbar.tsx / ReportForm.tsx / IssueCard.tsx
        │   ├── IssueDetail.tsx / AdminIssuesList.tsx
        │   ├── StatusBadge.tsx / ThemeToggle.tsx / Providers.tsx
        │   └── ui/ (avatar, badge, button, card, dialog, dropdown-menu,
        │           input, label, select, skeleton, table, textarea, …)
        ├── lib/
        │   ├── supabase/client.ts   # browser client
        │   ├── supabase/server.ts   # server client (cookies bridge)
        │   ├── actions/auth.ts      # login / register / logout
        │   ├── actions/issues.ts    # createIssue, getMyIssues, getAllIssues,
        │   │                        # getIssueById, updateIssueStatus, getDashboardStats
        │   └── utils.ts             # cn()
        ├── types/index.ts           # Role, Category, Status, Profile, Issue
        └── middleware.ts            # session refresh + role-based routing
```

## Data Model (Supabase)

No SQL migrations are checked into the repo — create these in the Supabase dashboard / SQL editor:

**`profiles`** (one row per `auth.users` id)

| column | type |
|---|---|
| `id` | UUID PK → `auth.users.id` |
| `full_name` | text |
| `role` | text (`citizen` \| `admin`) |
| `created_at` | timestamptz |

**`issues`**

| column | type |
|---|---|
| `id` | UUID PK |
| `title` / `description` | text |
| `category` | `pothole` \| `garbage` \| `streetlight` \| `water` \| `other` |
| `status` | `pending` \| `in_progress` \| `resolved` (default `pending`) |
| `image_url` | text nullable (public Storage URL) |
| `location` | text nullable |
| `reported_by` | UUID FK → `profiles.id` |
| `created_at` / `updated_at` | timestamptz |

**Storage:** public bucket `issue-images`, object path `{userId}/{timestamp}-{rand}.{ext}`. `createIssue` uploads then stores `getPublicUrl()` in `image_url`.

**RLS (recommended):** citizens can insert/select/update-own issues; admins full access; users read/update own profile. Never expose the service-role key on the client — only `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

```ts
// types (src/types/index.ts)
type Role = 'citizen' | 'admin';
type Category = 'pothole' | 'garbage' | 'streetlight' | 'water' | 'other';
type Status = 'pending' | 'in_progress' | 'resolved';
```

## Auth & Routing

`src/middleware.ts` (matcher: `/home`, `/login`, `/register`, `/report*`, `/my-reports*`, `/dashboard*`, `/issues*`):
1. Refreshes the Supabase session.
2. Unauthenticated → `/login?redirect=<path>`.
3. Authenticated on `/login` or `/register` → `/dashboard` (admin) or `/home` (citizen).
4. Citizen hitting admin routes → `/home`; admin hitting citizen routes → `/dashboard`.
5. Role is read from `profiles.role`.

Server Actions (`lib/actions/auth.ts`): `login()` → `signInWithPassword` → redirect `/report`; `register()` → `signUp({ full_name, role })` → `/login?message=…`; `logout()` → `signOut`.

## Getting Started

### Prerequisites
- Node.js 20+, npm
- A Supabase project (URL + anon key), with the tables/bucket/RLS above

### 1. Install & configure
```bash
cd civic-reporter
npm install
```

Create `civic-reporter/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Run
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 3. Build / lint
```bash
npm run build
npm run lint
```

## Key Implementation Notes
- Server Components by default; Client Components only for interactivity (`Navbar`, `ReportForm`, `AdminIssuesList`, `IssueDetail`, auth pages).
- Data pages use `force-dynamic` + `noStore()`; mutations revalidate with `revalidatePath`.
- Joins use `profiles:reported_by(full_name, role)` to show reporter info.
- Image validation happens client-side (type + 5 MB) and upload happens server-side in `createIssue`.

## Roadmap (MVP order per AGENTS.md)
1. Project setup ✅ 2. Schema + RLS ⬜ (code-ready, apply in dashboard) 3. Auth + role routing ✅ 4. Citizen report + my-reports ✅ 5. Admin dashboard + status update ✅ 6. Polish loading/error states ✅
