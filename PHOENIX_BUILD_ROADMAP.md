# PHOENIX — Build Roadmap
### Personal Developer Growth OS · Target: April 30, 2027

This file is meant to live at the repo root. Reference it in Antigravity prompts
("build X per PHOENIX_BUILD_ROADMAP.md, Phase N") so the agent stays grounded
in the design system and current phase instead of drifting to generic defaults.

---

## 0. Scope Strategy (read this first)

The full product vision spans 50 sections. Do not prompt an agent with the whole
spec at once — it produces shallow, inconsistent results across too wide a
surface. Work **one phase at a time**, each phase fully working and deployed
before starting the next.

Ship early: Phase 1 goes live on Vercel with zero backend. You get a working,
shareable app in days, not months.

---

## 1. Design Tokens (paste into `frontend/src/styles/tokens.css`)

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

Aesthetic: Linear / GitHub / modern SaaS. Dark cockpit, restrained gradients,
generous whitespace. Not glassmorphism, not neon. The current Phoenix
screenshot (light theme, generic cards) does **not** match this — it gets
replaced, not reskinned. The data-first pattern from Phoenix V2→V3 (a single
array/state object as source of truth, UI reads from it) carries forward.

---

## 2. Architecture

```
Phase 1–2:  Frontend only (Vite + React + TS + Tailwind) → Vercel
Phase 3+:   + Node/Express/TS backend + PostgreSQL → Railway
```

Repo layout:
```
/frontend   (Vercel deploys this, root dir = frontend)
/backend    (Railway deploys this, root dir = backend)
```

---

## 3. Phase-by-Phase

### Phase 1 — UI MVP (mock data only)
Build: Dashboard, sidebar nav, readiness score card, today's mission cards,
roadmap view, focus timer UI, basic task list. All data hardcoded/mocked.
**Antigravity mode:** full autonomy — greenfield, low risk, easy to redo.
**Deploy:** Vercel, immediately. This is your first real milestone.

### Phase 2 — Real state
Replace mocks with React state + localStorage persistence. Dynamic tasks,
goals, roadmap progress calculated from actual state, not hardcoded numbers.
**Antigravity mode:** full autonomy, but review the state shape before moving
to Phase 3 — this becomes your API contract later.
**Deploy:** still Vercel only.

### Phase 3 — Backend
Node + Express + TypeScript REST API, PostgreSQL, JWT auth (register/login,
hashed passwords, protected routes).
**Antigravity mode:** checkpoint — pause and review the schema and auth flow
before it writes migrations. This is expensive to redo wrong.
**Deploy:** Railway (see deployment steps below). Frontend still points to
mock/local state until this is verified working via Postman/curl.

### Phase 4 — Full CRUD
Wire frontend to the real API. Replace localStorage calls with fetch calls
through a service layer (`services/api.ts`). Loading/error/empty states on
every view.
**Antigravity mode:** full autonomy per endpoint, checkpoint on the service
layer abstraction itself.

### Phase 5 — Professional engineering
Tests (auth, task CRUD, readiness calculation, DSA tracking), input
validation, centralized error handling, Docker Compose for local Postgres,
env-based secrets.
**Antigravity mode:** checkpoint. This is where sloppy agent output causes
real bugs later.

### Phase 6 — Advanced features
DSA revision engine (spaced repetition: 3/7/14/30 day intervals), analytics
dashboard, achievements, notifications, command palette (Ctrl+K), PWA install.
**Antigravity mode:** full autonomy per feature — these are additive and
isolated.

### Phase 7 — AI Coach
Only after 1–6 are stable and generating real data to reason over. An AI
coach with no real usage history to draw from just produces generic
motivational text — the opposite of what section 46 (principle #2) wants.

---

## 4. MVP Data Model (Phase 1–3 scope only — expand later)

```
User          { id, name, targetDate, careerGoal, stack[] }
Task          { id, title, category, priority, status, deadline, goalId }
Goal          { id, title, level (vision|longterm|monthly|weekly), parentId, progress }
RoadmapNode   { id, category, title, status, progress, confidence }
DsaProblem    { id, name, platform, url, difficulty, pattern, status,
                language: "Java",   // ← your actual practice language
                confidence (green|yellow|red), lastSolved, nextRevision }
Project       { id, name, repoUrl, deployUrl, stack[], progress,
                sections: { frontend, backend, database, auth, deploy } }
FocusSession  { id, taskId, duration, startTime, endTime, rating, reflection }
```

Note: `Project` deliberately stores a repo/deploy URL rather than embedding
another codebase — the IV Management Platform stays its own repo, Phoenix
just tracks it.

---

## 5. Deployment

**Vercel (frontend)**
1. Import GitHub repo, framework preset: Vite, root directory: `frontend`
2. Env var `VITE_API_URL` (placeholder until Railway backend exists)
3. Auto-deploys on push to `main`, preview URLs per PR

**Railway (backend + DB)**
1. New project → Add PostgreSQL plugin (auto-generates `DATABASE_URL`)
2. Add a service from the same repo, root directory `backend`
3. Env vars: `JWT_SECRET`, `CORS_ORIGIN` = your Vercel domain
4. Copy the generated public backend URL into Vercel's `VITE_API_URL`, redeploy frontend

Check current Railway/Vercel pricing pages before committing — free tier
limits shift over time.

---

## 6. Working Agreement with Antigravity

- Full autonomy → new UI components, isolated features, boilerplate
- Checkpoint → data model, auth, anything that's expensive to redo
- Step-approval → nothing here needs this tier unless you add payments later
- Commit git yourself per completed task — don't rely on agent-managed branches
- Every prompt references this file + the current phase number
