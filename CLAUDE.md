# CLAUDE.md

Guidance for AI assistants and contributors working in this repo.

## What this is

Sproutflow CRM Lite — a lean Next.js 16 (App Router) + Supabase relationship
tracker: leads, clients, notes, follow-ups, dashboard, and a public `/demo`.
See [README.md](README.md) for the full overview and [TESTING.md](TESTING.md)
for testing details.

## Stack conventions

- **Next.js 16 App Router**, React 19, TypeScript (strict).
- **Server actions** (`app/**/actions.ts`) for mutations; validate input with the
  Zod schemas in `lib/crm/validation.ts` before touching Supabase.
- **Supabase** via the helpers in `lib/supabase/` (`server.ts` for RSC/actions,
  `client.ts` for client components). Keep action logic thin.
- **UI**: Tailwind CSS 4 + shadcn/ui (`components/ui/`). Brand font is Fraunces
  (`font-display`); body is Geist. Colors come from CSS variables in
  `app/globals.css` — use tokens, not hard-coded hex.
- Use the `@/` import alias for absolute imports.

## Testing is required

**Every new feature or bug fix must ship with tests** — see
[TESTING.md](TESTING.md) for the policy. In short:

- Pure logic (validation, helpers, mappers) → Vitest unit tests.
- Client components with behavior → React Testing Library.
- New routes / redirect behavior → extend `scripts/smoke-test.mjs`.
- Bug fixes → add a test that fails before the fix.

## Definition of done

A change is done only when all of these pass locally (CI runs the same):

```bash
npm run lint
npm test
npm run build
npm run test:smoke
```
