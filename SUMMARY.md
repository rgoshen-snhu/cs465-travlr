# SUMMARY.md — Travlr Getaways Change Log

## [2026-04-13] Commit Summary

**Change Type:** Chore
**Scope:** Tooling / Baseline

**Summary:**
Phase 0 baseline: added ESLint (flat config), Prettier, and markdownlint
configurations. Fixed three pre-existing lint errors found during initial
scan (undefined `err` references in authentication and trips controllers;
`const`-reassignment bug in travel controller).

**Rationale:**
Consistent linting and formatting enforced from the start prevents style
drift across six implementation phases. Fixing pre-existing errors before
any feature work ensures future `npm run lint` runs produce a clean baseline
that CI can rely on.

**References:**
- PLAN.md: Phase 0 — Baseline & Tooling

---

## [2026-04-13] Phase 0 Complete

**Change Type:** Docs
**Scope:** Phase 0 — Baseline & Tooling

**Summary:**
All Phase 0 deliverables complete. ESLint (flat config), Prettier, markdownlint
configs in place; SUMMARY.md and TODO.md scaffolds created; `npm run lint` exits
cleanly with 0 errors. Branch `feature/phase-0-baseline` ready for PR to
`final-project`.

**Rationale:**
Establishes the tooling gate and documentation discipline that all subsequent
phases (1–6) will build on.

**References:**
- PLAN.md: Phase 0 DoD

---

## [2026-04-13] Phase 1 Complete — Migrate All Public Data to MongoDB

**Change Type:** Feature
**Scope:** Phase 1 — MongoDB Models & Seed

**Summary:**
Added four new Mongoose models (Room, Meal, NewsArticle, HomeContent) and
extended the User model with a `role` field. All five models are registered
in `db.js` via side-effect imports. Extended `seed.js` to populate all new
collections from the existing `data/*.json` files (delete-then-insert,
idempotent). Fixed a pre-existing bug in `package.json` where the `seed`
script pointed to `app-server/models/seed.js` instead of the correct
`app-api/models/seed.js`. `npm run seed` now confirms all five collections
are seeded successfully.

**Rationale:**
Moving all content into MongoDB is the prerequisite for Phase 2 (API
endpoints) and Phase 3 (controller rewiring). The news JSON used a nested
structure; it was normalized into flat `NewsArticle` documents discriminated
by `articleType` so the API can filter with a simple query parameter.

**Issues encountered & resolution:**
- News JSON had three differently-shaped sections. Resolved by a
  `buildNewsArticles()` normalizer in seed.js that maps each section to
  the shared `NewsArticle` schema.
- `seed` npm script path was wrong (pointed to `app-server/`). Fixed in
  the same commit.

**References:**
- PLAN.md: Phase 1 — Migrate All Public Data to MongoDB

---

## [2026-04-13] Phase 2 Complete — Complete the API Layer

**Change Type:** Feature / Refactor
**Scope:** Phase 2 — API Layer

**Summary:**
Added four public GET endpoints (`/api/rooms`, `/api/meals`, `/api/news`,
`/api/home`) with one controller file per resource. `GET /api/news` supports
an optional `?type=` query parameter to filter by `articleType`. Confirmed
`tripsAddTrip` and `tripsUpdateTrip` were already implemented; corrected the
HTTP status on PUT from `201 Created` to `200 OK`. Fixed a Mongoose 9
compatibility bug in `db.js` where `connection.close()` no longer accepts a
callback — updated to async/await. All error responses normalized to
`{ message }` with `error.message` (no raw error objects or stack traces).

**Issues encountered & resolution:**
- Port 3000 was already occupied during smoke testing; killed the stale
  process and retested successfully.
- `connection.close()` threw on SIGTERM in Mongoose 9 — fixed in the same
  refactor commit.

**References:**
- PLAN.md: Phase 2 — Complete the API Layer

---

## [2026-04-13] Phase 3 Complete — Wire All Public Controllers to API

**Change Type:** Refactor
**Scope:** Phase 3 — Public Controller Wiring

**Summary:**
Rewrote all four public-site controllers to fetch data from the API loopback
instead of reading flat JSON files. All pages now serve live MongoDB content.
No `require('fs')` or `readFileSync` calls remain in any `app-server/controllers/`
file. All pages verified 200 with correct content in browser smoke test.

**How:**
Each controller follows the `travel.js` reference pattern exactly:
`const port = process.env.PORT ?? 3000`, build endpoint URL, `async/await fetch`,
`try/catch` with `console.error`, render with `{ title, navPage, ...data, message }`.
The news controller uses `Promise.all` for three parallel fetches and maps
`publishedAt → date` to match the HBS template. The home controller does the
same for blog posts.

**Issues encountered & resolution:**
- News and index HBS templates reference `date` but the API stores `publishedAt`.
  Resolved in the controller layer with a `.toLocaleDateString()` mapping — no
  template changes required.

**References:**
- PLAN.md: Phase 3 — Wire All Public Controllers to API

---

## [2026-04-13] Phase 4 Complete — Admin SPA: Complete & Verify

**Change Type:** Fix
**Scope:** Phase 4 — Admin SPA

**Summary:**
Angular SPA builds and runs without errors. Fixed four pre-existing bugs in the
auth flow: `AuthResponse` constructor ignored its `token` parameter; JWT
interceptor `startsWith('login')` never matched full URLs; login form
incorrectly required a `name` field; `doLogin()` checked `isLoggedIn()` before
the async HTTP response arrived (setTimeout race condition). All fixed.
Add-trip and edit-trip forms confirmed wired to the correct API endpoints.
Admin user seeded: `admin@travlr.com / Admin1234!` (idempotent — skips if
admin already exists).

**Issues encountered & resolution:**
- No compile errors on initial build.
- Login async race: replaced setTimeout with Observable subscription in
  component — navigation now happens in `next()` callback.
- Login form had a `name` field that blocked login since `name` is not a
  login credential — removed from both component and template.

**References:**
- PLAN.md: Phase 4 — Admin SPA: Complete & Verify
