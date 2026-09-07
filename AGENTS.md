# AGENTS.md – Civic Issue Reporter

## CRITICAL RULES

### Scope
- Stick strictly to the MVP features defined in PROMPT.md.
- Do not add extra features, pages, or libraries unless explicitly asked.
- No machine learning, no paid services, no external APIs beyond Supabase.

### Tech Stack (Do Not Deviate)
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Auth + PostgreSQL + Storage)
- Server Components by default, Client Components only when necessary
- Server Actions for mutations

### Response Style
- Keep responses concise and to the point - unless the user asks otherwise
- Prefer short, clear explanations over long essays.
- When writing code, show only the relevant parts unless the full file is needed.

### Change/Edit Mode
- Never implement features yourself when possible - use sub-agents!
- Identify changes from the plan that can be implemented in parallel, and use sub-agents to implement the features efficiently
- When using sub-agents to implement features, act as a coordinator only
- Use the best model for the task - premium models for complex tasks (like coding) and mid-tier models for simpler tasks, like documentation

### Planning
- Always ask clarifying questions
- Never assume design, tech stack or features
- Use deep-dive sub-agents to assist with research
- Use deep-dive sub-agents to review the different aspects of your plan before presenting to the user

### Implementation Order
1. Project setup (Next.js + Tailwind + shadcn + Supabase clients)
2. Database schema + RLS policies
3. Authentication + role-based routing
4. Citizen: Report form + My Reports
5. Admin: Dashboard + Status update
6. Polish UI and error/loading states

### Supabase Rules
- Always use proper RLS policies.
- Never expose the service role key on the client.
- Use `@supabase/ssr` for server and client correctly.
- Prefer typed queries and clear error handling.

### Code Quality
- Write clean, readable, well-typed TypeScript.
- Use shadcn/ui components consistently.
- Handle loading and error states.
- Keep components small and focused.
- After major changes, suggest running `npm run build` or type-check.

### File & Structure Discipline
- Follow the exact folder structure defined in PROMPT.md.
- Do not create unnecessary files or folders.
- Put shared UI in `components/`, utilities in `lib/`, types in `types/`.

### Skills & MCP Usage
- Use the installed skills (especially supabase, vercel-react-best-practices, frontend-design) when relevant.
- Prefer the official Supabase MCP and Context7 MCP for accurate, up-to-date information.
- Use Playwright MCP for visual testing when needed.

### Testing & Verification
- After implementing a feature, verify the happy path.
- Check that roles work correctly (citizen vs admin).
- Confirm images upload and status updates work.

### UI Design
- Always follow the UI design system when creating or reviewing components or pages.
- Design System: @DESIGN.md 

### Communication
- When stuck, clearly state the blocker and ask for the next instruction.
- When finished with a task, summarize what was done in 2–4 short bullet points.