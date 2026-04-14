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

## Upcoming Phases

- **Phase 1** — MongoDB models (Room, Meal, NewsArticle, HomeContent, User.role) + seed
- **Phase 2** — REST API endpoints for rooms, meals, news, home; complete trips CRUD
- **Phase 3** — Rewrite public controllers to fetch() loopback; eliminate fs.readFileSync
- **Phase 4** — Admin SPA verify/fix; seed admin user
- **Phase 5** — Customer auth (/login, /signup, /logout; JWT HttpOnly cookie)
- **Phase 6** — Hardening, docs, SDD testing walkthrough, v1.0.0 tag
