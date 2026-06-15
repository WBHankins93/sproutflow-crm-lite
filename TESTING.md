# Testing

Sproutflow CRM Lite has two layers of automated testing. **Both run in CI on every pull request and push to `main`.**

| Layer | Tool | Scope | Command |
|---|---|---|---|
| Unit / component | [Vitest](https://vitest.dev) + React Testing Library | Pure logic and isolated components | `npm test` |
| Smoke (e2e-lite) | Node script (`scripts/smoke-test.mjs`) | Boots the production build and probes key routes | `npm run test:smoke` |

## Running tests

```bash
npm test          # run the unit/component suite once
npm run test:watch # re-run on change while developing
npm run test:smoke # boot the build and probe /demo, /login, and redirects
```

## What lives where

- Tests sit next to the code they cover, named `*.test.ts` / `*.test.tsx`
  (e.g. `lib/crm/validation.test.ts`, `components/clients/ClientsList.test.tsx`).
- Vitest config: `vitest.config.ts` · global setup: `vitest.setup.ts`
  (registers `@testing-library/jest-dom` matchers and unmounts trees between tests).
- The `@/` import alias works in tests exactly as it does in the app.

## ✅ Testing policy — required for every new feature

**Any new feature or bug fix from here on must ship with tests.** Use this as the bar:

- **Validation, helpers, mappers, and other pure logic** → unit tests
  (the cheapest, highest-value coverage — model the lead/client schema tests).
- **Client components with real behavior** (search, filtering, conditional
  rendering, form state) → component tests with React Testing Library.
- **New routes or auth/redirect behavior** → extend `scripts/smoke-test.mjs`.
- **Bug fixes** → add a test that fails before the fix and passes after, so the
  regression can't come back silently.

Server actions that hit Supabase are intentionally **not** unit-tested today;
keep their logic thin and push branching into the pure helpers that are tested.
End-to-end coverage of authenticated flows is a roadmap item (it needs a seeded
Supabase test project) — see the README roadmap.

A change is not "done" until `npm test`, `npm run lint`, `npm run build`, and
`npm run test:smoke` all pass locally.
