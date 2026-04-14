# Travlr Getaways — Refactor Implementation Plan

> **Scope.** Refactor the current codebase into the end-to-end product described in `docs/REQUIREMENTS.md`, using the wireframe as the UI contract and the SDD as the architectural contract.
>
> **Working method.** GitFlow branches, atomic Conventional Commits, strict TDD on new logic, and per-phase documentation discipline. Phases are sequential; tasks within a phase are atomic commits.

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
2. **TDD.** Red → Green → Refactor on every new unit of behavior (`AI_RULES.md` §1). Server code uses Jest; the Angular SPA continues with Karma + Jasmine.
3. **Per-phase deliverables.**
   - Close every task inside a phase as an atomic commit.
   - At phase completion, update **`SUMMARY.md`** with `What was done`, `How`, `Issues encountered & resolution`.
   - Final commit of the phase is `docs(summary): phase N complete — <title>` and updates SUMMARY.md.
   - Open a PR from `feature/phase-N-<slug>` into `develop` (per GitFlow in `AI_RULES.md` §2).
4. **Never break GET `/api/trips`.** The server-side public site and the Angular SPA both read from it in parallel; every change must keep the read path live.
5. **Stop and ask** if a phase reveals a contradiction with `docs/REQUIREMENTS.md` §11 Open Questions — do not silently invent a product decision.

---

## Phase Map

| Phase | Title                                            | Branch                              |
|-------|--------------------------------------------------|-------------------------------------|
| 0     | Baseline, Tooling, and SUMMARY scaffolding       | `feature/phase-0-baseline`          |
| 1     | Domain Model Extensions                          | `feature/phase-1-domain-model`      |
| 2     | API Layer Refactor & New Endpoints               | `feature/phase-2-api`               |
| 3     | Public Site — Shell (nav, home, design tokens)   | `feature/phase-3-public-shell`      |
| 4     | Public Site — Travel page (categories, search)   | `feature/phase-4-public-travel`     |
| 5     | Public Site — Customer Auth (login, signup)      | `feature/phase-5-public-auth`       |
| 6     | Public Site — Reservations & Checkout            | `feature/phase-6-public-booking`    |
| 7     | Admin SPA — Redesigned Layout & Trip Form        | `feature/phase-7-admin-ui`          |
| 8     | Hardening (security, a11y, test coverage) & Release | `feature/phase-8-hardening`      |

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

**Goal.** Make the repo ready for disciplined iterative work: predictable tests, lint, and the documentation loop described in Ground Rules §3.

**In scope.**

- Cut `develop` from `main` if not present.
- Create `feature/phase-0-baseline`.
- Add Jest for backend tests (`tests/` directory or `*.spec.js` beside source).
- Confirm Angular Karma/Jasmine still runs (`cd app-admin && npm test`).
- Add ESLint + Prettier configs (JS/TS) and `markdownlint` config (at minimum to quiet the warnings in current docs).
- Seed `SUMMARY.md` and `TODO.md` at repo root with the templates from `AI_RULES.md` §11.5.
- Make sure `.env.example` stays in sync with env reads and `.env` is gitignored.

**Out of scope.** Any behavior changes.

**Tasks (each = one commit).**

1. `chore(git): create develop branch from main` (if needed).
2. `chore(tooling): add eslint/prettier config for node and angular projects`.
3. `chore(tooling): add jest as backend test runner with sample passing spec`.
4. `chore(tooling): add markdownlint config to quiet existing warnings`.
5. `docs(plan): add SUMMARY.md and TODO.md scaffolds`.

**Tests.** One smoke Jest spec that imports `app.js` without errors; confirm Angular specs still green.

**Acceptance.** `npm test` (new) and `cd app-admin && npm test` both pass; `SUMMARY.md` and `TODO.md` exist.

**DoD.** Append to `SUMMARY.md`; commit `docs(summary): phase 0 complete — baseline & tooling`; open PR to `develop`.

---

## Phase 1 — Domain Model Extensions

**Goal.** Evolve the Mongoose models to cover customer accounts, trip categories, and bookings, as required by `docs/REQUIREMENTS.md` §9.

**In scope.**

- Extend **Trip** with `category: { type: String, enum: ['beach','cruise','mountain'], required: true, index: true }` and timestamps. Default existing trips to a category during migration.
- Extend **User** with `role: { type: String, enum: ['customer','admin'], default: 'customer', required: true }` and timestamps. Confirm password hashing lives in the model pre-save hook; if currently plaintext, fix here (hard requirement from `AI_RULES.md` §9).
- Add **Booking** model: `reference` (unique), `user` (ObjectId ref `users`), `tripCode` (ref by code string), `travelers`, `startDate`, `status` (`pending|confirmed|cancelled`), timestamps.
- Update `data/` seed JSON to include `category` for each trip, and extend `app-api/models/seed.js` for any new collections.

**Follow existing patterns.** Keep model definition style matching `app-api/models/travlr.js`. Register the new Booking model via `app-api/models/db.js`'s side-effect import pattern.

**Tasks.**

1. `feat(models): add category enum to trip schema`.
2. `feat(models): add role and timestamps to user schema`.
3. `feat(models): ensure user password is hashed on save`.
4. `feat(models): add booking schema and register in db.js`.
5. `chore(data): add category to seed trip fixtures`.
6. `test(models): unit tests for trip category validation, booking invariants, user role default and password hashing`.

**Tests.** Jest specs for model validation (required fields, enum constraints, password hashing effect, reference uniqueness).

**Acceptance.** `npm run seed` succeeds; `GET /api/trips` still returns trips (now with `category`).

**DoD.** SUMMARY update → commit → PR to `develop`.

---

## Phase 2 — API Layer Refactor & New Endpoints

**Goal.** Harden the REST surface and add what customer-facing features and admin features need (`docs/REQUIREMENTS.md` §§7.2, 7.3, 7.4, 7.5).

**In scope.**

- Extract `authenticateJWT` to `app-api/middleware/auth.js` (still used by the existing route file).
- Add `requireRole('admin')` middleware for admin-only routes; continue to allow any authenticated user for `/bookings/mine`.
- Extend `GET /api/trips` with optional query params: `category`, `q` (name/resort substring), `priceMin`, `priceMax`, `page`, `pageSize`. Keep the unfiltered call backwards-compatible (returns all trips).
- Add **Bookings API**:
  - `POST /api/bookings` (auth required) — create reservation.
  - `GET /api/bookings/mine` (auth required) — the caller's bookings.
  - `GET /api/bookings` (admin only) — all bookings.
- Add **Users API** (admin only): `GET /api/users`, `PUT /api/users/:id/role`, `DELETE /api/users/:id`.
- Normalize error responses: always `{ message }` on non-2xx; never leak stack traces.
- Controllers in `app-api/controllers/bookings.js` and `app-api/controllers/users.js`, mirroring `trips.js`.

**Follow existing patterns.** `router.route('/x').get(...).post(middleware, ...)` chaining in `app-api/routes/index.js`. Do **not** introduce `express.Router()` sub-routers per resource — the current codebase has a single flat router.

**Tasks.**

1. `refactor(api): extract authenticateJWT to middleware module`.
2. `feat(api): add requireRole middleware`.
3. `feat(api): add search, filter, and pagination query params to GET /api/trips`.
4. `feat(api): add bookings controller and routes`.
5. `feat(api): add users controller and admin routes`.
6. `refactor(api): normalize error response payloads`.
7. `test(api): add supertest coverage for trips filtering, bookings, users, auth and role gating`.

**Tests.** Supertest (Jest) integration suite covering: auth success/failure, role gating, filter query parsing, booking create/list, user list/role update/delete.

**Acceptance.** All new endpoints return documented shapes; admin SPA still renders trip list unchanged.

**DoD.** SUMMARY update → commit → PR to `develop`.

---

## Phase 3 — Public Site Shell (Nav, Home, Design Tokens)

**Goal.** Establish the wireframe-accurate public shell that every subsequent public page builds on (WF-1).

**UI design (WF-1).**

- Rebuild `partials/header.hbs` to exactly the nav contract:
  - Left: corp logo (use `docs/images/getaways_logo.png`, served from `/public/images/`).
  - Links in order: *Travel*, *News*, *Reservations*, *Admin*, *Checkout*, *Login*.
  - Pass `isLoggedIn` and `user` (populated by session middleware from Phase 5) into the layout. **Hide *Reservations* when `!isLoggedIn`** (the only Logged-In-Only item per the wireframe text version). *Admin* and *Checkout* remain visible to anonymous users and route to `/login?next=...` on click. Swap *Login* for *Logout* when logged in. Until Phase 5 lands, feed `isLoggedIn=false` so the conditional rendering is present but dormant.
  - Highlight the active item via the existing `eq` helper (`{{#if (eq navPage 'travel')}}active{{/if}}`) — pattern already used by this codebase.
- Rebuild `views/index.hbs` to the WF-1 hero layout: a row of three destination cards/placeholders over a background band.
- Establish **design tokens** in `public/stylesheets/tokens.css` (CSS custom properties) and base layout rules in `public/stylesheets/layout.css`. Share tokens with the Angular SPA by copying the file into `app-admin/src/styles/tokens.css` and importing it from `styles.css` — avoids introducing a new shared-package pattern.
- Add responsive breakpoints at 600 / 900 / 1280.

**Tasks.**

1. `refactor(views): replace header partial with wireframe-accurate nav`.
2. `feat(views): conditional admin/checkout/login nav items based on session flag`.
3. `feat(public): design tokens and base layout stylesheet`.
4. `refactor(views): rebuild home page hero per WF-1`.
5. `feat(public): skip-to-content link and landmark roles`.
6. `test(views): snapshot/smoke tests for header and home controllers`.

**Tests.** Supertest GETs on `/` return 200 with expected nav markup when logged-out.

**Acceptance.** Manual verification against WF-1 on desktop (1280) and mobile (360).

**DoD.** SUMMARY update → commit → PR to `develop`.

---

## Phase 4 — Public Site: Travel Page (Categories, Search, Pagination)

**Goal.** Deliver WF-2 as the primary browsing experience.

**UI design (WF-2).**

- Page title "Travel", subheader "Editable List of Stuff" becomes **"Browse Trips"** (substantive title; the wireframe placeholder text is not a requirement).
- Category tabs: *Beaches (n)*, *Cruises (n)*, *Mountains (n)*. Counts come from the API filter totals returned with the trip list.
- Search input, client-side debounced (300 ms) to hit `GET /api/trips?q=...&category=...`.
- Six-column table (ID / Name / Length / Start / Resort / Per Person) with row-hover highlight to match the blue selection style in the wireframe.
- Pagination controls (previous / next) on the lower right, wired to the API's `page`/`pageSize` params.
- The *Edit* action column is **admin-only** — omit on the public travel page; the admin SPA in Phase 7 surfaces it instead.
- The wireframe's *Add a Trip* button is **admin-only** and is omitted on the public page.

**Follow existing patterns.** Server-side render with HBS, driven by `app-server/controllers/travel.js` using its existing `fetch`-against-loopback pattern. The tab/search/pagination state lives in query string parameters (`?category=beach&page=2`) so the page stays SEO-friendly and back-buttonable.

**Tasks.**

1. `feat(public-travel): read category, q, page from query string in travel controller`.
2. `feat(public-travel): render category tabs with counts`.
3. `feat(public-travel): search form (GET) and results table`.
4. `feat(public-travel): pagination controls`.
5. `test(public-travel): controller tests for query handling and empty-state message`.

**Tests.** Supertest coverage: default view, category filter, search, empty state. Mock `fetch` against the API layer.

**Acceptance.** Table matches WF-2 columns; tabs and search change the visible rows; pagination reflects API totals.

**DoD.** SUMMARY update → commit → PR to `develop`.

---

## Phase 5 — Public Site: Customer Auth (Login, Signup, Session)

**Goal.** Deliver WF-3 (Login) and WF-4 (Sign Up), and wire the session flag that the Phase 3 navbar is already reading.

**UI design.**

- **WF-3 Login**: page at `/login`, centered form card: email + password, *Login* button, *Forgot password?* link (routes to `/reset-password` — see §Open Questions in REQUIREMENTS; stub page acceptable for this release unless confirmed).
- **WF-4 Sign Up**: page at `/signup`, centered form card with *Name*, *Email*, *Password* (with help icon showing password rules tooltip on focus), *Re-type password*, Terms/Privacy checkbox, *Sign up* button, *Learn more* link routed to a static `/about` section.
- Form errors render inline, tied to `aria-describedby` for the affected input; invalid fields get `aria-invalid="true"`.

**Session.**

- Introduce a minimal Express session using `cookie-parser` (already a dep) to store the JWT in an `HttpOnly` cookie set at login/signup. Middleware parses the cookie into `res.locals.isLoggedIn` + `res.locals.user` for HBS templates.
- Logout route clears the cookie.

**Follow existing patterns.** New server routes `/login`, `/signup`, `/logout`, `/reset-password` follow the `app-server/routes/*.js` + `app-server/controllers/*.js` pattern. The controllers use the loopback `fetch` to call `POST /api/login` and `POST /api/register`.

**Tasks.**

1. `feat(public-auth): login page and POST handler setting httpOnly cookie`.
2. `feat(public-auth): signup page with client + server validation`.
3. `feat(public-auth): logout route`.
4. `feat(public-auth): session middleware populating res.locals.isLoggedIn and user`.
5. `feat(public-auth): forgot-password stub page`.
6. `test(public-auth): controller specs for login/signup happy path and error paths`.

**Tests.** Integration: posting to `/login` with good creds sets a cookie; subsequent GET `/` renders *Admin* and *Checkout* in nav.

**Acceptance.** WF-3 and WF-4 look and behave correctly on desktop and mobile; nav conditional rendering works end-to-end.

**DoD.** SUMMARY update → commit → PR to `develop`.

---

## Phase 6 — Public Site: Reservations & Checkout

**Goal.** Close the customer loop from discovery → booking → "I can see my booking later" (`docs/REQUIREMENTS.md` §§7.3, 7.4, FR-CAT-004).

**UI design.**

- **Checkout (`/checkout/:tripCode`)** — accessible only when logged in (middleware redirects to `/login?next=...`). Shows trip summary card (reuse the home-page trip card markup), traveler count input, start date (if multiple available), confirm button. Submits to `POST /api/bookings`.
- **Reservations (`/reservations`)** — accessible only when logged in. Lists the caller's bookings (reference, trip name, start date, traveler count, status). Uses `GET /api/bookings/mine`.
- Confirmation partial after a successful booking: reference number, trip name, returning-home CTA. No email or payment in this release (per Q-1 + Q-4 in REQUIREMENTS).

**Follow existing patterns.** Controllers pull JWT from the session cookie and forward it as `Authorization: Bearer ...` to the loopback API call — matches how the admin SPA already calls the API.

**Tasks.**

1. `feat(public-booking): checkout page rendering trip summary and booking form`.
2. `feat(public-booking): POST handler that calls bookings API with session JWT`.
3. `feat(public-booking): reservations page listing current user's bookings`.
4. `feat(public-booking): confirmation partial after successful booking`.
5. `test(public-booking): controller specs including auth-redirect when not logged in`.

**Tests.** Controller tests for auth-gated redirects; booking creation happy path.

**Acceptance.** A new customer can register, log in, book a trip, and see it in `/reservations`.

**DoD.** SUMMARY update → commit → PR to `develop`.

---

## Phase 7 — Admin SPA Redesign (Layout, Trip Form, Users, Reservations)

**Goal.** Rebuild the Angular admin app to match WF-5.

**UI design (WF-5).**

- **Shell layout**: standalone `ShellComponent` wraps `<router-outlet>` and renders:
  - A blue left **sidebar**: "My Project" logo tile at the top, vertical links *Travel*, *Reservations*, *Users*, *Settings*. Collapsed on narrow viewports into a top drawer.
  - A top action bar with help / messages / mail / profile icons (icons as inline SVG; profile menu includes Logout).
- **Trip form component** (replaces current `add-trip` and `edit-trip` templates — or shared): fields *ID*, *Destination*, *Length of Stay* (two numeric steppers: nights + days), *Start Date* (with calendar icon), *Resort*, *Per Person*, plus **Category** (drop-down: Beach / Cruise / Mountain — required by Phase 1 schema), **Image URL**, and **Description**. Use `ReactiveFormsModule` for stronger validation.
- **Reservations component** (`/reservations`): table of all bookings via `GET /api/bookings` (admin), with user, trip, start date, status, and a status change control.
- **Users component** (`/users`): table via `GET /api/users` with role toggle (customer ↔ admin) and delete.
- **Settings component** (`/settings`): placeholder card "No settings in this release." Confirms the route exists and is protected behind admin role.

**Follow existing patterns.**

- Standalone Angular 17 components, `CommonModule` + `Reactive/FormsModule` imports.
- New services in `app-admin/src/app/services/`: extend `trip-data.service.ts` for new filter params; add `booking-data.service.ts` and `user-data.service.ts` in the same shape.
- Continue using the `BROWSER_STORAGE` injection token for any client-side persistence; do not add a new storage abstraction.
- Use the existing JWT interceptor; extend it if new endpoints require auth, don't duplicate it.

**Routing.**

- `app.routes.ts` becomes: `{ path: '', component: ShellComponent, canActivate: [adminGuard], children: [ ... ] }` with child routes for `trips`, `trips/new`, `trips/:code`, `reservations`, `users`, `settings`, and the public-facing `login` kept outside the shell.

**Tasks.**

1. `feat(admin-ui): add shell component with sidebar and top bar`.
2. `refactor(admin-ui): reorganize routes behind shell and admin guard`.
3. `refactor(admin-ui): rebuild add/edit trip forms with reactive forms and wireframe fields`.
4. `feat(admin-ui): reservations page consuming GET /api/bookings`.
5. `feat(admin-ui): users page with role toggle and delete`.
6. `feat(admin-ui): settings placeholder page`.
7. `test(admin-ui): unit specs for new components and services`.

**Tests.** Karma/Jasmine: component rendering, guard redirect for non-admin, service calls hit expected URLs.

**Acceptance.** The SPA visually matches WF-5 and supports trip CRUD, reservations view, user management.

**DoD.** SUMMARY update → commit → PR to `develop`.

---

## Phase 8 — Hardening & Release

**Goal.** Reach the non-functional bar before shipping (`docs/REQUIREMENTS.md` §8).

**In scope.**

- **Security**: add `helmet`, tighten CORS to only the configured SPA origin (from env), rate-limit `/api/login` and `/api/register` (e.g. `express-rate-limit`), confirm cookies are `HttpOnly` + `SameSite=Lax` + `Secure` in non-dev.
- **Accessibility**: run axe on every public page and the SPA shell; fix contrast, labels, landmarks, focus order.
- **Test coverage**: push backend coverage to ≥ 80% on changed code; SPA specs likewise. Add a minimal end-to-end smoke script (Node `fetch` against running server) covering register → login → book → view.
- **Docs**:
  - Update `README.md` with the new routes, roles, and scripts.
  - Add an **ADR** at `docs/adr/ADR-001-dual-app-mvc-spa.md` confirming the dual-surface pattern and why we kept server-rendered HBS alongside an Angular admin.
  - Refresh SDD §User Interface with screenshots of the delivered SPA (the section still has placeholders).
- **Seed data**: populate realistic trips across all three categories so the UI demos well.
- **Release**: merge `develop` → `release/1.0.0` → `main` with tag `v1.0.0` per GitFlow.

**Tasks.**

1. `feat(security): add helmet, tighten cors, rate-limit auth endpoints`.
2. `fix(a11y): address axe findings on public pages and admin shell`.
3. `test(coverage): raise coverage to the AI_RULES threshold on changed code`.
4. `docs(readme): update with new routes, scripts, and roles`.
5. `docs(adr): ADR-001 dual-app MVC+SPA pattern`.
6. `docs(sdd): fill in User Interface section with SPA screenshots`.
7. `chore(data): refreshed seed with multi-category trips`.
8. `chore(release): bump version, tag v1.0.0`.

**Acceptance.** All ground-rule checks pass; manual UAT against the wireframes succeeds; rubric criteria (Customer-Facing Website, MVC Routing, Render Test Data, NoSQL Database, RESTful API, Testing, SPA, Security, Clear Communication) are each covered by demonstrable behavior.

**DoD.** SUMMARY update → commit → merge per GitFlow.

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
- Related REQUIREMENTS: FR/NFR IDs
- PRs: <link(s)>
```

---

## Traceability

| Phase | Primary REQUIREMENTS IDs covered                                          | Primary wireframe(s) |
|-------|----------------------------------------------------------------------------|----------------------|
| 0     | NFR-MAINT-002, NFR-MAINT-003, NFR-MAINT-004                                | —                    |
| 1     | §9.1, §9.2, NFR-SEC-003                                                    | —                    |
| 2     | FR-API-001, FR-API-002, FR-AUTH-001..003, FR-CAT-003, FR-BK-001, FR-ADM-005 | —                    |
| 3     | G-1, G-2, NFR-A11Y-001                                                     | WF-1                 |
| 4     | FR-CAT-001, FR-CAT-002, FR-CAT-003                                         | WF-2                 |
| 5     | FR-ACC-001, FR-ACC-002                                                     | WF-3, WF-4           |
| 6     | FR-CAT-004, FR-BK-001, FR-BK-002                                           | —                    |
| 7     | FR-ADM-001..005, G-5                                                       | WF-5                 |
| 8     | NFR-SEC-001..004, NFR-A11Y-001, NFR-MAINT-002, G-6                         | —                    |
