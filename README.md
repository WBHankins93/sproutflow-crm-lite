# Sproutflow CRM Lite

Sproutflow CRM Lite is a lean relationship tracker for small teams that need a simple system of record: leads, clients, notes, follow-ups, and a clean daily dashboard. It is the public, barebones version of the larger Sproutflow CRM platform.

## Demo

Run the app and open the seeded walkthrough:

```bash
npm install
npm run dev
```

Then visit [http://localhost:3000/demo](http://localhost:3000/demo).

The demo does not require Supabase credentials. It uses local in-browser sample data so reviewers can try the core workflow immediately:

- Review dashboard metrics and follow-ups
- Open leads and clients
- Add demo notes
- Convert a lead into a client

## MVP Scope

Included:

- Supabase email/password authentication
- Dashboard with client, lead, and follow-up summaries
- Lead CRUD with source, status, follow-up date, notes, and conversion to client
- Client CRUD with company, status, follow-up date, and notes
- Basic settings page with team member visibility
- Public `/demo` walkthrough with seeded data

Not included in the lite version:

- Deals pipeline
- Document storage
- Commissions
- Messaging
- Policy tracking
- Carrier access
- Advanced reporting
- Advanced team administration

## Database

This app currently uses Supabase:

- Supabase Postgres for application data
- Supabase Auth for login/session management
- Supabase RLS policies from the SQL migrations

Neon is available, but this codebase is already wired for Supabase. Keeping Supabase is the fastest MVP path because auth, database, and future file storage can live together. If the broader umbrella standard becomes Neon, plan a separate migration branch with an auth decision first.

## Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Required environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Without real Supabase values, the authenticated app redirects to `/login` but cannot sign in. The `/demo` route remains available for walkthroughs.

## Database Setup

For a fresh Supabase project, run:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_crm_lite_workflow.sql`

For an existing project that already ran the initial schema, run only:

1. `supabase/migrations/002_crm_lite_workflow.sql`

Then create the first user in Supabase Auth and assign the role in `public.users`.

## Project Structure

```text
app/demo                         Public seeded demo
app/(auth)                       Login flow
app/(dashboard)                  Authenticated CRM pages and server actions
components/demo                  Demo workspace UI
components/leads                 Lead forms, lists, and conversion controls
components/clients               Client forms and lists
components/notes                 Shared notes UI
lib/supabase                     Supabase client helpers
supabase/migrations              Database migrations
types/database.ts                Hand-maintained Supabase database shape
```

## Verification

```bash
npm audit
npm run lint
npm run build
npm run test:smoke
```

The smoke test starts the production build locally and verifies:

- `/demo` renders seeded walkthrough content
- `/login` renders the sign-in form
- protected routes redirect to `/login` without a session

Authenticated end-to-end testing still requires a seeded Supabase project and test user.

## Continuous Integration

GitHub Actions runs the same public verification path on pull requests and pushes to `main`:

- dependency install with `npm ci`
- `npm audit`
- `npm run lint`
- `npm run build`
- `npm run test:smoke`

## Roadmap

Phase 1: CRM-lite foundation
- Strip full-CRM routes from the lite surface
- Keep leads, clients, settings, and dashboard
- Add notes, follow-ups, validation, and lead conversion
- Document Supabase as the current DB choice

Phase 2: Production readiness
- Add organization/workspace scoping if this serves multiple client companies
- Tighten RLS around workspace membership
- Add invite/onboarding flow
- Add automated end-to-end tests with seeded test data

Phase 3: Deployment
- Configure production Supabase
- Set hosting environment variables
- Smoke test auth and CRUD in production
- Create release checklist for client onboarding

## License

Copyright (c) WBHankins93. All rights reserved.
