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

## Upcoming Phases

- **Phase 3** — Rewrite public controllers to fetch() loopback; eliminate fs.readFileSync
- **Phase 4** — Admin SPA verify/fix; seed admin user
- **Phase 5** — Customer auth (/login, /signup, /logout; JWT HttpOnly cookie)
- **Phase 6** — Hardening, docs, SDD testing walkthrough, v1.0.0 tag
