# Design System – Civic Issue Reporter

This is a public-facing civic application. The design should feel clean, trustworthy, modern, and easy to use for both citizens and administrators.

---

## Design Direction

- Professional and approachable (government + citizen friendly)
- Clean and uncluttered
- Clear visual hierarchy
- High readability
- Soft modern aesthetic (not overly flashy or “AI-generated”)

Avoid:
- Dark “hacker” themes
- Heavy glassmorphism
- Loud gradients
- Overly playful or childish colors

---

## Tech Stack for UI

- Tailwind CSS
- shadcn/ui components
- Lucide React icons
- Inter or system font stack (clean and highly readable)

---

## Color Palette

Use a calm, professional palette:

| Role              | Suggested Color          | Usage                              |
|-------------------|--------------------------|------------------------------------|
| Primary           | Blue (sky-600 / blue-600)| Buttons, links, active states      |
| Background        | White / slate-50         | Page background                    |
| Card              | White                    | Cards and panels                   |
| Border            | slate-200                | Subtle borders                     |
| Text Primary     | slate-900                | Headings and important text        |
| Text Secondary   | slate-600                | Supporting text                    |
| Success           | emerald-600              | Resolved status                    |
| Warning           | amber-500                | In Progress status                 |
| Danger / Pending  | rose-500 / orange-500    | Pending status                     |

Status Badge Colors:
- Pending → amber / orange
- In Progress → blue
- Resolved → green

---

## Typography

- Font: Inter (or system-ui)
- Headings: font-semibold or font-bold, tracking-tight
- Body: text-sm or text-base, leading-relaxed
- Keep text hierarchy clear and generous spacing

---

## Layout Guidelines

- Use max-w-5xl or max-w-6xl containers for content
- Consistent page padding: px-4 py-6 md:px-6 md:py-8
- Cards should have rounded-xl, subtle shadow, and clear padding
- Good vertical spacing between sections (space-y-6 or space-y-8)
- Mobile-first responsive design

### Key Pages Layout

**Citizen – Report Page**
- Clean centered form
- Clear labels
- Large photo upload area
- Primary “Submit Report” button

**Citizen – My Reports**
- List of IssueCards
- Status badge clearly visible
- Empty state when no reports exist

**Admin – Dashboard**
- Simple table or card grid of all issues
- Filters (optional but nice): Status / Category
- Clear “View” action

**Admin – Issue Detail**
- Full details + image
- Status update controls (dropdown or buttons)
- Clear visual feedback when status is updated

---

## Components Style

### Cards
- White background
- rounded-xl
- border border-slate-200
- shadow-sm
- hover:shadow-md transition

### Buttons
- Primary: solid blue, medium size
- Secondary: outline
- Destructive: red (use sparingly)
- Consistent height and rounded-lg

### StatusBadge
- Small rounded-full pill
- Bold text
- Clear color coding (see palette above)

### Forms
- Clear labels above inputs
- Good spacing between fields
- Helpful placeholder text
- Error states in red

### Navbar
- Simple top navigation
- Show current user role
- Logout button
- Clean and minimal

---

## Interaction & Feedback

- Subtle hover states
- Clear loading indicators (skeleton or spinner)
- Success and error toasts (use shadcn toast)
- Disabled states should be obvious
- Focus rings must be visible for accessibility

---

## Accessibility

- High contrast text
- Visible focus states
- Proper labels on all form fields
- Status information should not rely only on color
- Mobile-friendly touch targets

---

## Overall Feeling

The app should feel like a modern, reliable municipal service — simple enough for any citizen to use, and clear enough for administrators to work efficiently.