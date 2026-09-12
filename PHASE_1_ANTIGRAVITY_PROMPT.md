# Phase 1 Prompt — Paste this into Antigravity

Reference `PHOENIX_BUILD_ROADMAP.md` at the repo root for full context. This
prompt covers **Phase 1 only** — frontend, mock data, no backend calls, no
auth.

---

Build Phase 1 (UI MVP) of **Phoenix**, a personal Developer Growth OS.

**Stack:** Vite + React + TypeScript + Tailwind CSS.

**Design system** — apply via CSS variables, never hardcode hex values inside
components:

```css
:root {
  --bg: #070B17;
  --bg-secondary: #0A1020;
  --panel: #0D1425;
  --panel-hover: #111A2E;
  --text: #F5F7FF;
  --text-secondary: #9BA5BA;
  --text-muted: #657087;
  --accent: #7C6CFF;
  --accent-light: #9B8CFF;
  --success: #4ADE80;
  --blue: #60A5FA;
  --orange: #FB923C;
  --pink: #F472B6;
}
```

Aesthetic: dark developer cockpit — Linear / GitHub / modern SaaS dashboard
inspiration. Deep charcoal/navy backgrounds, restrained purple accent, soft
borders, rounded panels, generous whitespace, subtle shadows, smooth
micro-interactions. Explicitly avoid neon colors, heavy gradients,
glassmorphism, visual noise. **This is a full visual rebuild of the existing
Phoenix codebase, not a reskin** — the current version (white cards, indigo
sidebar, default form inputs) does not carry over visually. The existing
data-first state pattern (single source-of-truth array/object driving the UI)
does carry over conceptually.

## Pages to build this phase

**1. Dashboard**
- Header: logo, target date (April 30, 2027), dynamically calculated days
  remaining, notification icon, settings, profile
- Greeting: "Good morning/afternoon/evening, Fahad" based on system time +
  subtitle + "Start Today's Mission" button
- Developer Readiness card: percentage, progress bar, breakdown by category
  (Development, DSA, Projects, AI, CS Fundamentals, Interview Readiness,
  System Design, Git/Deployment) — mock the numbers, but build the component
  to accept real props
- Today's Mission: cards for DSA / Development / Project / AI / Academics,
  each showing title and progress fraction

**2. Navigation**
- Desktop sidebar: Dashboard, Roadmap, Tasks, DSA Arena, Projects, Learning,
  Analytics, AI Coach, Settings, Help
- Mobile bottom nav: Home, Tasks, DSA, Projects, Stats

**3. Roadmap** — interactive list/tree across: Frontend, Backend, Database,
DSA, Computer Science, System Design, DevOps, AI/ML, Interview Preparation.
Each node has: status (Locked / Not Started / Learning / Practicing /
Comfortable / Mastered), progress %, confidence, a short checkpoint checklist
(see below), and a resource list.

**Checkpoint pattern** — each Roadmap and Learning Hub node supports a short
ordered checklist the user ticks off as they progress (e.g. for a "React"
node: "Built a component with props", "Used useState", "Fetched data with
useEffect"). Model as `checkpoints: { label: string, done: boolean }[]` on
the node.

**Resource types** (for node resource lists and Learning Hub): official docs,
MDN, freeCodeCamp, Programming with Mosh, roadmap.sh, YouTube, articles,
books, LeetCode. Resources are references only — never force completion of
every one.

**4. Focus timer** — 25/45/60/custom minute options, countdown display,
post-session reflection form (rating + 3 short-answer fields). UI flow only,
no persistence yet.

**5. Task list** — create/view tasks: title, category, priority, status,
deadline. Empty state: "No missions yet. Create your first mission and start
forging your day."

**6. Calendar** — month view (current: September 2026) plus a day view that
renders this recurring weekly schedule as background time blocks, with room
for one-off tasks to layer on top without conflicting:

```ts
export const weeklySchedule = {
  weekday: [
    { start: "05:00", end: "05:55", title: "Workout", category: "health" },
    { start: "05:55", end: "06:25", title: "Get Ready", category: "routine" },
    { start: "06:25", end: "06:55", title: "DSA Warm-up", category: "dsa" },
    { start: "07:15", end: "19:30", title: "College", category: "academics" },
    { start: "20:30", end: "21:45", title: "Dev — Phoenix/IV Platform", category: "development" },
    { start: "22:00", end: "23:00", title: "DSA / Academics", category: "dsa" },
  ],
  weekend: [
    { start: "06:00", end: "06:45", title: "Workout", category: "health" },
    { start: "07:15", end: "09:15", title: "DSA Deep Work", category: "dsa" },
    { start: "09:30", end: "11:30", title: "Project Dev", category: "development" },
    { start: "13:00", end: "15:00", title: "Flex Deep Work", category: "development" },
  ],
};
```

**7. Projects** — cards only this phase, no real CRUD yet:
- IV Management Platform (flagship, in progress — React/TS/Node/Express/
  PostgreSQL/Docker, currently building the frontend UI shell with dummy
  data)
- One second-project placeholder card (pick one: College Event Management,
  Student Productivity Platform, or Placement Preparation Platform) —
  quality bar for it: 5–6 meaningful features, real-world problem, not a
  toy app
- AI Placement Assistant (future — resume analysis, skill-gap detection,
  mock interview)

## Required on every view
Loading, Success, Empty, and Error states. No blank/undecorated cards.

## Constraints this phase
- Mock data only — no fetch calls, no backend, no auth
- Accessible: semantic HTML, keyboard navigation, visible focus states,
  sufficient contrast against the dark background
- Mobile-first responsive, matching the nav spec above
- Do **not** implement yet: AI Coach, DSA revision engine, analytics,
  notifications, achievements, command palette, GitHub integration,
  authentication, PostgreSQL, Docker — later phases
