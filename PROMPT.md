# Civic Issue Reporter – Project Prompt

You are building a full-stack web application for the Smart India Hackathon problem statement:

**SIH25031 – Crowdsourced Civic Issue Reporting and Resolution System**  
(Organization: Government of Jharkhand | Theme: Clean & Green Technology)

## Goal
Create a clean, working MVP that allows citizens to report civic issues and allows admins to manage and resolve them.  
Focus only on the core flow. Keep everything simple, fast, and production-ready looking.

## Tech Stack (Strict)
- **Frontend + Backend**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database + Auth + Storage**: Supabase (PostgreSQL + Auth + Storage)
- **Language**: TypeScript
- **Deployment target**: Vercel

Do not use any other framework, database, or authentication system.

## Core Features (MVP Only)

### Citizen Side
- Register / Login
- Report a new issue (title, description, category, photo, location)
- View “My Reports” with current status

### Admin Side
- Admin Login
- Dashboard showing all reported issues
- View issue details + image
- Update status: Pending → In Progress → Resolved

### Common
- Role-based access (Citizen / Admin)
- Responsive design
- Clean and modern UI

## Database Schema (Supabase)

### profiles
- id (uuid, references auth.users)
- full_name
- role (citizen | admin)
- created_at

### issues
- id (uuid)
- title
- description
- category (pothole, garbage, streetlight, water, other)
- status (pending, in_progress, resolved)
- image_url
- location (text or lat/long)
- reported_by (uuid → profiles.id)
- created_at
- updated_at

Enable Row Level Security (RLS) properly:
- Citizens can only see and create their own issues
- Admins can see and update all issues

## Folder Structure
Follow this structure strictly:

app/
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── (citizen)/
│   ├── report/page.tsx
│   ├── my-reports/page.tsx
│   └── layout.tsx
├── (admin)/
│   ├── dashboard/page.tsx
│   ├── issues/[id]/page.tsx
│   └── layout.tsx
├── layout.tsx
├── page.tsx
└── globals.css

components/
├── ui/               # shadcn components
├── IssueCard.tsx
├── ReportForm.tsx
├── StatusBadge.tsx
└── Navbar.tsx

lib/
├── supabase/
│   ├── client.ts
│   └── server.ts
└── utils.ts

types/
└── index.ts

## Coding Guidelines
- Use Server Components by default. Use Client Components only when needed (forms, interactivity).
- Prefer Server Actions for mutations.
- Use shadcn/ui components for all UI elements.
- Keep code clean, typed, and well-organized.
- Handle loading and error states properly.
- Make the UI look polished and modern (good spacing, consistent colors, clear hierarchy).

## Constraints
- No machine learning or AI features.
- No paid services.
- Keep the scope strictly to the MVP features listed above.
- Do not add extra pages or features unless asked.

## Working Style
- First create the project structure and database schema.
- Then implement authentication and role-based routing.
- Then build the report form and my-reports page.
- Then build the admin dashboard and status update flow.
- Write clean, readable code that a student can understand and extend.

Start by scaffolding the Next.js project with Tailwind and shadcn/ui, then set up Supabase.