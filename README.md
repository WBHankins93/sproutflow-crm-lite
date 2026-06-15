<div align="center">

# 🌱 Sproutflow CRM Lite

**A lean relationship tracker for small teams** — leads, clients, notes, follow-ups, and a clean daily dashboard. The public, barebones edition of the larger Sproutflow CRM platform.

[![CI](https://github.com/WBHankins93/sproutflow-crm-lite/actions/workflows/ci.yml/badge.svg)](https://github.com/WBHankins93/sproutflow-crm-lite/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth-3FCF8E?logo=supabase&logoColor=white)

[Live demo](#-demo) · [Quick start](#-quick-start) · [Features](#-features) · [Project structure](#-project-structure) · [Roadmap](#-roadmap)

</div>

---

## 🚀 Demo

No Supabase credentials required — the `/demo` route runs on in-browser sample data so reviewers can try the core workflow immediately.

```bash
npm install
npm run dev
```

Then open **[localhost:3000/demo](http://localhost:3000/demo)** and:

- 📊 Review dashboard metrics and follow-ups
- 👥 Browse seeded leads and clients
- 📝 Add demo notes
- 🔄 Convert a lead into a client

---

## ✨ Features

| Area | What you get |
|---|---|
| 🔐 **Auth** | Supabase email/password sign-in with protected routes |
| 📊 **Dashboard** | Live client / open-lead / follow-up counts and a "Follow Up Next" list |
| 👥 **Leads** | Full CRUD with source, status, follow-up date, notes, and one-click conversion to client |
| 🤝 **Clients** | Full CRUD with company, status, follow-up date, and notes |
| 🗒️ **Notes** | Timestamped notes on any lead or client |
| ⚙️ **Settings** | Team-member visibility |
| 🌿 **Public demo** | Seeded `/demo` walkthrough, no login needed |

**Intentionally out of scope** for the lite edition: deals pipeline, document storage, commissions, messaging, policy tracking, carrier access, advanced reporting, and advanced team administration.

---

## 🧱 Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) · React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 · shadcn/ui · Fraunces + Geist |
| Data & Auth | Supabase (Postgres, Auth, Row-Level Security) |
| Validation | Zod |
| Testing | Vitest · React Testing Library · route smoke test |

> **Why Supabase?** The codebase is already wired for Supabase, so auth, database, and future file storage live together — the fastest MVP path. Neon remains an option; if the umbrella standard moves to Neon, plan a separate migration branch with an auth decision first.

---

## ⚡ Quick start

```bash
npm install
cp .env.example .env.local   # then fill in the two values below
npm run dev
```

Open **[localhost:3000](http://localhost:3000)**.

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

> Without real Supabase values the authenticated app redirects to `/login` but cannot sign in. The `/demo` route stays available for walkthroughs.

---

## 🗄️ Database setup

Run the migrations in order against your Supabase project's SQL editor:

| # | Migration | Adds |
|---|---|---|
| 1 | `supabase/migrations/001_initial_schema.sql` | Core tables, RLS policies, signup trigger |
| 2 | `supabase/migrations/002_crm_lite_workflow.sql` | Follow-up dates and the `notes` table |
| 3 | `supabase/migrations/003_crm_lite_indexes.sql` | Query indexes for dashboard and notes lookups |

- **Fresh project:** run `001` → `002` → `003`.
- **Existing project** already on the initial schema: run `002` → `003`.

Then create the first user in Supabase Auth and assign their role in `public.users`.

---

## 🗂️ Project structure

```text
app/demo                         Public seeded demo
app/(auth)                       Login flow
app/(dashboard)                  Authenticated CRM pages and server actions
components/demo                  Demo workspace UI
components/leads                 Lead forms, lists, and conversion controls
components/clients               Client forms and lists
components/notes                 Shared notes UI
components/layout                Sidebar and header
lib/supabase                     Supabase client helpers
lib/crm                          Zod validation schemas
supabase/migrations              Database migrations
types/database.ts                Hand-maintained Supabase database shape
```

---

## ✅ Verification & testing

```bash
npm audit          # dependency check
npm run lint       # eslint
npm test           # Vitest unit + component suite
npm run build      # production build
npm run test:smoke # boots the build and probes key routes
```

Two layers of automated testing run in CI:

- **Unit / component** ([Vitest](https://vitest.dev) + React Testing Library) — covers validation schemas, helpers, and client-component behavior.
- **Smoke (e2e-lite)** — boots the production build and checks that `/demo` and `/login` render and that protected routes redirect to `/login` without a session.

> 📐 **New features must ship with tests.** See **[TESTING.md](TESTING.md)** for the policy and how to add coverage. Authenticated end-to-end testing still requires a seeded Supabase project and test user (roadmap).

### Continuous integration

GitHub Actions runs the same path on every pull request and push to `main`: `npm ci` → `npm audit` → `npm run lint` → `npm test` → `npm run build` → `npm run test:smoke`.

---

## 🗺️ Roadmap

**Phase 1 — Foundation** ✅
Leads, clients, settings, and dashboard with notes, follow-ups, validation, and lead conversion on Supabase.

**Phase 2 — Production readiness**
Workspace/organization scoping, tighter RLS around membership, an invite/onboarding flow, and seeded end-to-end tests.

**Phase 3 — Deployment**
Production Supabase config, hosting environment variables, production auth/CRUD smoke tests, and a client-onboarding release checklist.

---

## 📄 License

Copyright © WBHankins93. All rights reserved.
