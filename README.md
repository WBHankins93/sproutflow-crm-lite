# Sproutflow CRM Lite

Sproutflow CRM Lite is the stripped-down CRM for clients that need a simple system of record without the heavier workflows in the full CRM.

## Current MVP Scope

- Supabase email/password authentication
- Dashboard with client, lead, and follow-up summaries
- Lead CRUD with status, source, follow-up date, notes, and conversion to client
- Client CRUD with status, company, follow-up date, and notes
- Basic settings page with team member visibility

Intentionally out of scope for this lite MVP branch: deals, documents, commissions, messaging, policy tracking, carrier access, reports, and advanced team administration.

## Database

This app currently uses Supabase:

- Supabase Postgres for application data
- Supabase Auth for login/session management
- Supabase RLS policies from the SQL migrations

Neon is available, but this codebase is already wired for Supabase. Keeping Supabase is the fastest MVP path because auth, database, and future file storage can live together. If the broader umbrella standard becomes Neon, plan a separate migration branch with an auth decision first.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Required environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Database Setup

For a fresh Supabase project, run:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_crm_lite_workflow.sql`

For an existing project that already ran the initial schema, run only:

1. `supabase/migrations/002_crm_lite_workflow.sql`

Then create the first user in Supabase Auth and assign the role in `public.users`.

## Verification

```bash
npm run lint
npm run build
```

End-to-end smoke testing should cover login, dashboard, lead creation, lead notes, lead conversion, client editing, client notes, and sign out.

## Phase Plan

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
