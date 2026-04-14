# Travlr Getaways — Refactor Implementation Plan

> **Scope.** Refactor the current codebase into the end-to-end product described in `docs/REQUIREMENTS.md`, using the wireframe as the UI contract and the SDD as the architectural contract.
>
> **Working method.** Feature branches off `final-project` (treated as `main`), atomic Conventional Commits, functional testing aligned with the course rubric, and per-phase documentation discipline. Phases are sequential; tasks within a phase are atomic commits.
>
> **Branch model.** `final-project` is the integration branch (acts as `main`). Each phase lives on `feature/phase-N-<slug>`, branched from `final-project` and merged back via PR. No separate `develop` branch is needed.

---

## Reference Documents

Every phase must be read against these sources. If a phase conflicts with any of them, stop and reconcile before writing code.

| Document                                                                           | Role                                                                                      |
|------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| `docs/REQUIREMENTS.md`                                                             | Functional and non-functional requirements; the **what** of the product.                  |
| `docs/Project Guidelines and Rubric.md`                                            | Course rubric; every requirement traces back to a rubric criterion.                       |
| `docs/Travlr_Software_Design_Document_v2.md`                                       | Architecture (component, sequence, class diagrams), design constraints, and API endpoints. |
| `docs/CS 465 Travlr Getaways Wireframe.pdf`                                        | Visual wireframe (WF-1..WF-5). Authoritative for layout and visual hierarchy.             |
| `docs/Travlr_Getaways_Wireframe_Text_Version.docx`                                 | Narrative description of each wireframe screen. **Tiebreaker** when the visual is ambiguous. |
| `docs/images/component_diagram.png` / `sequence_diagram.png` / `class_diagram.png` | Referenced by the SDD; consult when a phase touches cross-layer behavior or data modeling. |
| `docs/images/getaways_logo.png`                                                    | Corp logo asset for the WF-1 navbar (Phase 3).                                            |
| `README.md`                                                                        | Current developer onboarding and run instructions; must be updated in Phase 8.           |
| `SUMMARY.md`                                                                       | Per-phase log of what was done, how, and issues encountered.                              |
| `TODO.md`                                                                          | Forward-looking plan entries per `AI_RULES.md` §11.5.                                     |
| `~/.claude/CLAUDE.md` (`AI_RULES.md`)                                              | Global engineering rules: TDD, GitFlow, Conventional Commits, security, a11y, coverage.   |

---

## Ground Rules (apply to every phase)

1. **Follow existing patterns.** Do not introduce new architectural flavors alongside the ones already in the codebase. Specifically:
   - **Server-side controllers (`app-server/controllers/*.js`)** — use `async/await` with `fetch` against the loopback API URL built from `process.env.PORT`, `try/catch` with a console-logged error, and `res.render(view, { title, navPage, ...data, message })`. See `app-server/controllers/travel.js` as the reference.
   - **HBS views** — extend existing partials in `app-server/views/partials/`. Use the registered `eq` helper for nav highlighting rather than adding new helpers unless necessary.
   - **API routes (`app-api/routes/index.js`)** — chain with `router.route(...).get(...).post(authenticateJWT, ...)`. Reuse the existing `authenticateJWT` middleware; extract it to its own file only when a second route file needs it.
   - **API controllers (`app-api/controllers/*.js`)** — one file per resource, export named handlers, use Mongoose model methods directly.
   - **Mongoose models** — declared in `app-api/models/`, required for side-effect registration via `app-api/models/db.js`.
   - **Angular components (`app-admin/src/app/**`)** — Angular 17 **standalone** components, `CommonModule` + `FormsModule`/`ReactiveFormsModule` imports, `templateUrl` + `styleUrl` pair, services under `services/`, models under `models/`, `BROWSER_STORAGE` injection token for `localStorage` access.
   - **Config** — read via `process.env` with a safe local default, consistent with `app-api/models/db.js` and `bin/www`.
   - **Commit style** — Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`, `perf:`), atomic, no AI co-author tags (per `AI_RULES.md` §2).
2. **Testing (aligned with course rubric).** The rubric criterion "Testing" (15 pts) requires demonstrating the application can store and retrieve data via input/output — this is **functional testing**, not automated TDD. The SDD reinforces this: "describe the process of testing to make sure the SPA is working with the API to GET and PUT data in the database." Each phase's testing deliverable is therefore a documented, reproducible functional test (Postman, browser, or a minimal Node script) showing the feature works end-to-end. Automated Jest/Supertest unit tests are welcome where they add value but are **not required by the rubric**.
3. **Per-phase deliverables.**
   - Close every task inside a phase as an atomic commit.
   - At phase completion, update **`SUMMARY.md`** with `What was done`, `How`, `Issues encountered & resolution`.
   - Final commit of the phase is `docs(summary): phase N complete — <title>` and updates SUMMARY.md.
   - Open a PR from `feature/phase-N-<slug>` into `final-project`.
4. **Never break GET `/api/trips`.** The server-side public site and the Angular SPA both read from it in parallel; every change must keep the read path live.
5. **Stop and ask** if a phase reveals a contradiction with `docs/REQUIREMENTS.md` §11 Open Questions — do not silently invent a product decision.
6. **Available tooling for execution.**
   - **GitHub CLI (`gh`)** — create branches, open PRs, view CI status.
   - **MongoDB MCP** — inspect live collections, verify seed data, run ad-hoc queries against the local database without leaving the editor.
   - **Context7 MCP** — fetch up-to-date docs for Express, Mongoose, Angular 17, and other dependencies before writing code.
   - **Playwright MCP** — drive a real browser for functional verification steps; use instead of manual browser checks where repeatability matters.

---

## Phase Map

| Phase | Title                                                    | Branch                              |
|-------|----------------------------------------------------------|-------------------------------------|
| 0     | Baseline, Tooling, and SUMMARY scaffolding               | `feature/phase-0-baseline`          |
| 1     | Migrate All Public Data to MongoDB                       | `feature/phase-1-mongodb-migration` |
| 2     | Complete the API Layer                                   | `feature/phase-2-api`               |
| 3     | Wire All Public Controllers to API                       | `feature/phase-3-public-wiring`     |
| 4     | Admin SPA — Complete & Verify                            | `feature/phase-4-admin-spa`         |
| 5     | Customer Auth (Login, Signup)                            | `feature/phase-5-customer-auth`     |
| 6     | Hardening & Release                                      | `feature/phase-6-hardening`         |

---

## Data Architecture Principle

**All public content must flow through MongoDB → API → controller → HBS view.** No controller may read from a flat JSON file. The `data/` folder is seed-only: it provides initial data for `npm run seed` and is never read at request time. `app-server/controllers/travel.js` is the reference implementation for every public controller.

---

## UI Source of Truth

The UI matches the five wireframe screens. The visual PDF is the primary source; the text version (`docs/Travlr_Getaways_Wireframe_Text_Version.docx`) is the tiebreaker when the visual is ambiguous. The UI spec below reflects reconciliation against both.

- **WF-1 Home** (URL `https://travlr.com`) — Top navbar: *Corp Logo* | *Travel* | *News* | *Reservations* | *Admin* | *Checkout* (shopping-cart icon) | *Login* (person icon). **Per the text version, only *Reservations* is gated as "Logged In Only";** *Admin* and *Checkout* are always present in the nav and route unauthenticated users to `/login` when clicked. (Admin is further role-gated on the server in Phase 8.) Body is a hero area with destination placeholder images.
- **WF-2 Travel** (URL `https://travlr.com/travel`) — Page title "Travel". Sub-header line + a back-link. Category tabs *Beaches (n)*, *Cruises (n)*, *Mountains (n)* with counts. Search field above the list. An *Add a Trip* button. Six-column table: *ID, Name, Length, Start, Resort, Per Person*, plus an *Edit* link and an `X` (delete) affordance per row. Pagination *previous / next* at the bottom. First row highlighted in blue in the wireframe to show row-selection styling. **The wireframe shows admin-only affordances (*Add a Trip*, *Edit*, `X`) directly on this page; in the refactor these are rendered conditionally based on role**, so the same URL serves customers (read-only) and admins (editable) rather than duplicating the page at `/admin/travel`.
- **WF-3 Login** (URL `https://travlr.com`) — Same navbar as WF-1. Centered card: *Email*, *Password*, **Login** button, *Forgot password?* link.
- **WF-4 Sign Up** (URL `https://travlr.com`) — Same navbar. Centered card: *Name, *Email, *Password, *Re-type password, a checkbox "I agree to the Terms of Use and Privacy Policy" (both words are links), **Sign Up** button, *Learn More* link.
- **WF-5 Admin** (URL `https://travlr.com/admin`) — Blue left sidebar. Top of sidebar shows an **envelope icon** titled *"My Project"*. Vertical nav: *Travel, Reservations, Users, Settings*. Main content area contains a form titled *"Group Name"* (kept as a reusable fieldset title; the actual page title becomes "Add Trip" / "Edit Trip"). Fields: *ID*, *Destination*, *Length of Stay* (separate numeric steppers for Nights and Days, default 3/3), *Start Date* (date input with calendar icon), *Resort*, *Per Person*. The admin SPA continues to run on its own dev server in development; routing it under `/admin` in production is captured as a deployment concern for Phase 8.

**Design-tokens to introduce in Phase 3** (kept minimal, consistent across HBS and Angular):
- Primary blue (matches the WF-5 sidebar and existing link blue in WF-1/2).
- Neutral greys for tabs, table borders, backgrounds.
- Type scale: page title, section title, body, caption.
- 8-px spacing grid.

---

## Phase 0 — Baseline, Tooling, SUMMARY Scaffolding

**Goal.** Make the repo ready for disciplined iterative work: consistent lint config, documentation scaffolding, and a clean environment baseline. Branch from `final-project`.

**In scope.**

- Create `feature/phase-0-baseline` from `final-project`.
- Add ESLint + Prettier configs (JS/TS) so editors stay consistent.
- Seed `SUMMARY.md` and `TODO.md` at repo root.
- Confirm `.env.example` is in sync with actual env reads and `.env` is gitignored.
- Verify the app starts (`npm start`) and the Angular SPA builds (`cd app-admin && ng build`) without errors — these are the baseline smoke checks.

**Out of scope.** Any behavior changes. Automated test frameworks (Jest, Supertest) are not required by the rubric and are not added here; functional testing will be demonstrated manually per the course rubric.

**Tasks (each = one commit).**

1. `chore(tooling): add eslint/prettier config for node and angular projects`.
2. `chore(tooling): add markdownlint config to quiet existing doc warnings`.
3. `docs(plan): add SUMMARY.md and TODO.md scaffolds`.

**Functional verification.** `npm start` reaches the home page; `cd app-admin && ng serve` loads the admin SPA without console errors.

**Acceptance.** `SUMMARY.md` and `TODO.md` exist; app and SPA start cleanly; lint runs without fatal errors.

**DoD.** Append to `SUMMARY.md`; commit `docs(summary): phase 0 complete — baseline & tooling`; open PR to `final-project`.

---

## Phase 1 — Migrate All Public Data to MongoDB

**Goal.** Move every piece of content currently read from flat JSON files into MongoDB collections, so the API is the single source of truth for all public data.

**In scope.**

- Add **Room** Mongoose model: `name`, `image`, `description`, `rate`. Seed from `data/rooms.json`.
- Add **Meal** Mongoose model: `name`, `image`, `description`, `price`, `type` (`breakfast|lunch|dinner|specialty`). Seed from `data/meals.json`.
- Add **NewsArticle** Mongoose model: `title`, `image`, `summary`, `body`, `publishedAt` (Date), `articleType` (`latestNews|vacationTips|featured`). Seed from `data/news.json`.
- Add **HomeContent** Mongoose model: `hero` (object with `heading`, `subheading`, `image`), `testimonial` (object), `sidebar` (object). Seed from `data/home.json`.
- Extend **User** with `role: { type: String, enum: ['customer','admin'], default: 'customer', required: true }`. Confirm password is hashed by the pre-save hook (not stored plaintext).
- Register all new models via `app-api/models/db.js` side-effect imports.
- Extend `app-api/models/seed.js` to seed all new collections (delete-then-insert, idempotent).

**Follow existing patterns.** Model definition style matches `app-api/models/travlr.js`. Seed style matches the existing `seed.js` pattern.

**Tasks.**

1. `feat(models): add Room, Meal, NewsArticle, HomeContent schemas and register in db.js`.
2. `feat(models): add role to user schema; confirm password hashing pre-save hook`.
3. `chore(seed): extend seed.js to populate rooms, meals, news, and home collections`.

**Functional verification.** Run `npm run seed`; connect via MongoDB MCP and confirm `rooms`, `meals`, `newsarticles`, and `homecontents` collections each contain the expected documents.

**Acceptance.** All five collections (`trips`, `rooms`, `meals`, `newsarticles`, `homecontents`) are seeded without errors.

**DoD.** SUMMARY update → commit → PR to `final-project`.

---

## Phase 2 — Complete the API Layer

**Goal.** Expose all content collections via the REST API so every public controller can use the loopback fetch pattern.

**In scope.**

- Add `app-api/controllers/rooms.js` — `roomsList` handler: `GET /api/rooms` (public).
- Add `app-api/controllers/meals.js` — `mealsList` handler: `GET /api/meals` (public).
- Add `app-api/controllers/news.js` — `newsList` handler: `GET /api/news` (public, supports optional `?type=` filter for `latestNews|vacationTips|featured`).
- Add `app-api/controllers/home.js` — `homeContent` handler: `GET /api/home` (public, returns the single HomeContent document).
- Wire all four into `app-api/routes/index.js` using the existing `router.route(…).get(…)` pattern.
- Confirm `POST /api/trips` (`tripsAddTrip`) and `PUT /api/trips/:tripCode` (`tripsUpdateTrip`) are fully implemented in `app-api/controllers/trips.js` — these are already routed but may be stubs.
- Normalize error responses across all controllers: always `{ message }` on non-2xx; never leak stack traces.

**Follow existing patterns.** One controller file per resource. `router.route('/x').get(handler)` in the single flat `app-api/routes/index.js`. No sub-routers.

**Tasks.**

1. `feat(api): add rooms, meals, news, and home controllers and GET routes`.
2. `feat(api): complete tripsAddTrip and tripsUpdateTrip controller methods`.
3. `refactor(api): normalize error response payloads across all controllers`.

**Functional verification.** Use Postman or browser to confirm each new endpoint returns the correct JSON: `GET /api/rooms`, `GET /api/meals`, `GET /api/news`, `GET /api/news?type=vacationTips`, `GET /api/home`. Confirm `POST /api/trips` (with JWT) creates a trip and `PUT /api/trips/:code` updates it.

**Acceptance.** All new GET endpoints return data; trips CRUD endpoints work with JWT auth; existing `GET /api/trips` unchanged.

**DoD.** SUMMARY update → commit → PR to `final-project`.

---

## Phase 3 — Wire All Public Controllers to API

**Goal.** Eliminate every `fs.readFileSync` call from the public-site controllers. All data reaches the HBS views through the API loopback, matching the pattern in `app-server/controllers/travel.js`.

**In scope.**

- Rewrite `app-server/controllers/rooms.js` — async fetch from `GET /api/rooms`, render `rooms` view.
- Rewrite `app-server/controllers/meals.js` — async fetch from `GET /api/meals`, render `meals` view.
- Rewrite `app-server/controllers/news.js` — async fetch from `GET /api/news`, render `news` view (pass `latestNews`, `vacationTips`, `featured` slices from the returned array filtered by `articleType`).
- Rewrite `app-server/controllers/main.js` — async fetch from `GET /api/home` and `GET /api/news?type=latestNews`, render `index` view.
- Remove `data/` reads at request time. The `data/*.json` files remain on disk as seed-only inputs; no production code reads them after this phase.

**Follow existing patterns.** Identical structure to `travel.js`: `const port = process.env.PORT ?? 3000`, build endpoint URL, `async/await fetch`, `try/catch` with `console.error`, render with `{ title, navPage, ...data, message }`.

**Tasks.**

1. `refactor(controllers): wire rooms controller to GET /api/rooms`.
2. `refactor(controllers): wire meals controller to GET /api/meals`.
3. `refactor(controllers): wire news controller to GET /api/news`.
4. `refactor(controllers): wire home controller to GET /api/home and GET /api/news`.

**Functional verification.** With `npm start` running: browse to `/`, `/rooms`, `/meals`, `/news` in a browser and confirm each page renders content drawn from MongoDB (stop the server and empty a collection via MongoDB MCP — the page should show the empty-state message, proving it is not reading the JSON file).

**Acceptance.** No `require('fs')` or `readFileSync` calls remain in any `app-server/controllers/*.js` file; all public pages render live database content.

**DoD.** SUMMARY update → commit → PR to `final-project`.

---

## Phase 4 — Admin SPA: Complete & Verify

**Goal.** Confirm the Angular admin SPA is fully functional end-to-end: login, list trips, add a trip, edit a trip, and logout. Fix any broken wiring without redesigning the UI.

**In scope.**

- Verify `POST /api/register` and `POST /api/login` return the expected token shape; align the Angular `AuthenticationService` if needed.
- Confirm `tripsAddTrip` (Phase 2) and `tripsUpdateTrip` (Phase 2) work from the SPA add/edit forms.
- Fix any runtime errors in `app-admin` (broken imports, missing env, CORS issues).
- Confirm the JWT interceptor attaches the token to add/edit requests.
- **Admin accounts are seeded, not self-registered.** Extend `seed.js` to create at least one admin user (hashed password) if none exists. The `/signup` route (Phase 5) is for customers only.

**Out of scope.** UI redesign, new sidebar, reservations/users pages. Those are deferred.

**Tasks.**

1. `fix(admin-spa): resolve any startup or compile errors in app-admin`.
2. `fix(admin-spa): confirm add-trip and edit-trip forms call the completed API endpoints`.
3. `chore(seed): seed an admin user account for development testing`.

**Functional verification.** Start `cd app-admin && ng serve`. Log in with the seeded admin credentials. Confirm the trip list loads. Add a new trip — confirm it appears in `GET /api/trips` and in the trip list. Edit that trip and confirm the change persists. Log out.

**Acceptance.** Admin can log in, create a trip, edit it, and log out without errors.

**DoD.** SUMMARY update → commit → PR to `final-project`.

---

## Phase 5 — Customer Auth (Login, Signup)

**Goal.** Deliver customer-facing login (WF-3) and sign-up (WF-4). Customers register themselves; admins are pre-seeded (Phase 4) and are not self-registered.

**UI design.**

- **`/login`** — centered form card: Email + Password fields, *Login* button, *Sign up* link. On success, store JWT in an `HttpOnly` cookie and redirect to `/travel`. On failure, render an inline error above the form.
- **`/signup`** — centered form card: Name, Email, Password, Re-type Password fields, *Sign Up* button, *Log in* link. Validates passwords match client-side before submitting. On success, auto-login (set cookie) and redirect to `/travel`. On failure, render inline errors.
- **`/logout`** — clears the cookie, redirects to `/`.
- Nav updates: pass `isLoggedIn` and `userName` into `res.locals` via middleware so `header.hbs` can show *Logout* instead of *Login* when a session is active.

**Follow existing patterns.** New routes in `app-server/routes/auth.js` mounted at `/`. New controller `app-server/controllers/auth.js` — uses `fetch` loopback to call `POST /api/login` and `POST /api/register`, exactly as other controllers call their API endpoints.

**Tasks.**

1. `feat(public-auth): login page, POST handler, and HttpOnly JWT cookie`.
2. `feat(public-auth): signup page and POST handler (customers only)`.
3. `feat(public-auth): logout route clearing cookie`.
4. `feat(public-auth): session middleware setting res.locals.isLoggedIn and userName`.
5. `refactor(views): update header.hbs to show Login/Logout based on session`.

**Functional verification.** In a browser: visit `/signup`, register as a new customer, confirm redirect to `/travel` and nav shows *Logout*. Visit `/logout`, confirm nav reverts to *Login*. Visit `/login`, log in with the same credentials, confirm session is restored. Attempt login with bad credentials and confirm inline error.

**Acceptance.** Customer registration and login work end-to-end; nav reflects session state; admin login via `/login` also works (same form, different role stored in JWT).

**DoD.** SUMMARY update → commit → PR to `final-project`.

---

## Phase 6 — Hardening & Release

**Goal.** Security hardening, documentation completion, and tagging the final release.

**In scope.**

- **Security**: add `helmet` middleware; tighten CORS to only `http://localhost:4200` (or env-configured origin); confirm the JWT cookie is `HttpOnly` + `SameSite=Lax`.
- **Functional testing documentation**: produce the end-to-end test walkthrough (seed → `npm start` → browse public pages → customer login → admin CRUD trips in SPA) with screenshots for the SDD §User Interface section. This is the primary "Testing" rubric deliverable.
- **Docs**:
  - Update `README.md` with all routes, seed instructions, and env variables.
  - Refresh `docs/Travlr_Software_Design_Document_v2.md` §User Interface with SPA screenshots and the testing walkthrough.
- **Release**: tag `v1.0.0` on `final-project` after all phases are merged.

**Tasks.**

1. `feat(security): add helmet and confirm HttpOnly cookie settings`.
2. `docs(readme): update with all routes, seed instructions, and env vars`.
3. `docs(sdd): add SPA screenshots and testing walkthrough to User Interface section`.
4. `chore(release): tag v1.0.0`.

**Functional verification.** `npm start`; browse every public page; log in as customer; log in as admin in SPA; add/edit a trip; confirm no console errors and no stack traces leak in API responses.

**Acceptance.** All rubric criteria (Customer-Facing Website, MVC Routing, Render Test Data, NoSQL Database, RESTful API, Testing, SPA, Security, Clear Communication) are demonstrably met; `v1.0.0` tag exists on `final-project`.

**DoD.** SUMMARY update → commit → PR to `final-project` → tag `v1.0.0`.

---

## Per-Phase SUMMARY.md Template

After each phase, append a block to `SUMMARY.md`:

```markdown
## [YYYY-MM-DD HH:MM] Phase N — <Title>

**Change Type:** Refactor | Feature | Docs
**Scope:** <areas touched>

**What was done:**
- <bullet>

**How it was done:**
- <approach, notable decisions, patterns followed>

**Issues encountered & resolution:**
- <issue> → <resolution>
- (or: "None")

**References:**
- PLAN.md: Phase N
- PRs: <link(s)>
```

---

## Traceability

| Phase | Rubric criteria covered                                                          | Wireframe(s) |
|-------|----------------------------------------------------------------------------------|--------------|
| 0     | (tooling baseline)                                                               | —            |
| 1     | NoSQL Database — models & seed for all collections                               | —            |
| 2     | RESTful API — all content endpoints + trips CRUD                                 | —            |
| 3     | Customer-Facing Website, MVC Routing, Render Test Data                           | WF-1..WF-2   |
| 4     | SPA — admin trip CRUD verified end-to-end                                        | WF-5         |
| 5     | Security — login form, customer registration, JWT session                        | WF-3, WF-4   |
| 6     | Security (hardening), Testing (walkthrough), Clear Communication (docs + release) | —           |
