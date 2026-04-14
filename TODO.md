# TODO.md — Travlr Getaways

## [2026-04-13] Feature: Phase 0 — Baseline & Tooling

**Objective:**
Establish consistent tooling (ESLint, Prettier, markdownlint) and documentation
scaffolds before any feature implementation begins. Provides a clean commit
baseline and enables `npm run lint` as a quality gate.

**Approach:**
- Add `eslint.config.mjs` (flat config) targeting app-server, app-api, app.js
- Add `.prettierrc` for consistent formatting
- Add `.markdownlint.json` to silence common false positives in course docs
- Create SUMMARY.md and TODO.md scaffolds
- Fix pre-existing lint errors discovered during initial scan

**Tests:**
- `npm run lint` exits 0 (verified: 0 errors, 6 warnings-only)

**Risks & Tradeoffs:**
- ESLint v10 flat config is not compatible with `.eslintrc.*` — if any tooling
  expects the legacy format, it must be updated.
- Angular app-client uses its own ESLint config; Node lint script intentionally
  excludes `app-client/` to avoid conflicts.

**Status:** COMPLETE

---

## [2026-04-13] Feature: Phase 1 — Migrate All Public Data to MongoDB

**Objective:**
Move every piece of content currently read from flat JSON files into MongoDB
collections, making the API the single source of truth for all public data.

**Approach:**
- Add Room, Meal, NewsArticle, HomeContent Mongoose models
- Extend User model with `role` field (customer | admin)
- Register all models in db.js via side-effect imports
- Extend seed.js to populate all five collections (delete-then-insert, idempotent)
- Normalize nested news JSON into flat NewsArticle documents tagged by articleType

**Tests:**
- `npm run seed` exits 0; all five collections confirmed populated

**Risks & Tradeoffs:**
- News JSON had three differently-shaped sections; normalized via buildNewsArticles()
- HomeContent is a single-document collection — unusual but justified by course scope

**Status:** COMPLETE

---

## [2026-04-13] Feature: Phase 2 — Complete the API Layer

**Objective:**
Expose all content collections via REST endpoints so every public controller
can fetch data through the API loopback instead of reading flat JSON files.

**Approach:**
- Add controllers for rooms, meals, news (with ?type= filter), and home
- Wire all four into app-api/routes/index.js
- Fix tripsUpdateTrip HTTP status 201→200
- Fix Mongoose 9 gracefulShutdown (connection.close() no longer accepts callback)
- Normalize error responses: { message } only, no raw error objects or stack traces

**Tests:**
- All six GET endpoints return 200 with correct JSON against live MongoDB
- GET /api/news?type=latestNews correctly filters to 4 articles
- npm run lint exits 0

**Risks & Tradeoffs:**
- GET /api/home returns a single document (findOne); if collection is empty,
  returns 404 — home page will need to handle this gracefully in Phase 3

**Status:** COMPLETE

---

## [2026-04-13] Feature: Phase 3 — Wire All Public Controllers to API

**Objective:**
Eliminate every `fs.readFileSync` call from the public-site controllers.
All data must reach HBS views through the API loopback, matching the pattern
in `app-server/controllers/travel.js`.

**Approach:**
- Rewrite rooms, meals, news, and main controllers to use async fetch()
- News controller uses Promise.all for three parallel fetches (latestNews,
  vacationTips, featured); maps publishedAt → date for HBS template
- Home controller fetches /api/home and /api/news?type=latestNews in parallel;
  maps publishedAt → date on blog posts and takes first 2

**Tests:**
- All four pages (/, /rooms, /meals, /news) return 200 with live MongoDB content
- grep confirms no readFileSync in any app-server/controllers file

**Risks & Tradeoffs:**
- Three parallel fetches on /news adds minor latency vs. one DB query;
  acceptable for course scope and keeps controller logic consistent
- publishedAt/date field mismatch handled in controller to avoid template changes

**Status:** COMPLETE

---

## [2026-04-13] Feature: Phase 4 — Admin SPA: Complete & Verify

**Objective:**
Confirm the Angular admin SPA is fully functional end-to-end: login, list trips,
add a trip, edit a trip, and logout. Fix any broken wiring without redesigning.

**Approach:**
- Build SPA to check for compile errors (none found)
- Fix AuthResponse constructor, JWT interceptor URL matching, login form name
  field, and async race condition in doLogin()
- Confirm add-trip and edit-trip call correct API endpoints (already wired)
- Seed admin user (admin@travlr.com / Admin1234!) idempotently in seed.js

**Tests:**
- `npx ng build` exits 0 before and after fixes
- `npm run seed` creates admin user on first run, skips on subsequent runs
- Admin can log in, list trips, add a trip, edit a trip, and log out

**Risks & Tradeoffs:**
- Admin credentials are in seed.js in plain text — acceptable for development;
  must be changed before any production deployment

**Status:** COMPLETE

---

## [2026-04-13] Feature: Phase 4 UI — Admin SPA Wireframe Redesign

**Objective:**
Redesign the Angular admin SPA to match WF-2 (Travel table) and WF-5 (Admin
sidebar layout and form fields) wireframes.

**Approach:**
- Replace top Bootstrap navbar with a blue left sidebar (WF-5): envelope icon,
  "My Project" branding, Travel / Reservations / Users / Settings nav links
- Convert trip listing from card grid to data table (WF-2): ID, Name, Length,
  Start, Resort, Per Person columns; Edit and Delete affordances for admins
- Move `editTrip()` into `TripListingComponent`; TripCardComponent no longer
  used in the listing view
- Update add-trip and edit-trip forms: WF-5 field labels, separate Nights/Days
  steppers for Length of Stay (default 3/3), Start Date as date input
- Parse existing `"N nights / M days"` strings in edit-trip on load; recombine
  on submit — no API or schema changes

**Tests:**
- `npx ng build` exits 0
- Admin can log in, see sidebar, view trip table, add trip, edit trip, log out

**Risks & Tradeoffs:**
- ISO timestamp → `yyyy-MM-dd` slice required for date input compatibility
- CurrencyPipe/DatePipe must be explicitly imported in standalone components

**Status:** COMPLETE

---

## Upcoming Phases

- **Phase 5** — Customer auth (/login, /signup, /logout; JWT HttpOnly cookie)
  + Reservation model, booking flow, /itinerary page, admin Reservations tab
- **Phase 6** — Hardening, docs, SDD testing walkthrough, v1.0.0 tag
