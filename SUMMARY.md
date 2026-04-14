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
