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

---

## [2026-04-13] Phase 4 UI — Admin SPA Redesign to Match Wireframes

**Change Type:** Feature
**Scope:** Phase 4 — Admin SPA UI (WF-2, WF-5)

**Summary:**
Redesigned the Angular admin SPA to match the WF-2 (Travel table) and WF-5
(Admin sidebar + form) wireframes. Replaced the Bootstrap top navbar with a
blue left sidebar containing an envelope icon, "My Project" branding, and
vertical nav links (Travel, Reservations, Users, Settings). Converted the trip
listing from a Bootstrap card grid to a data table with columns: ID, Name,
Length, Start, Resort, Per Person, Edit, and Delete. Edit/Delete columns render
conditionally for logged-in admins only. Updated add-trip and edit-trip forms
to use WF-5 field labels (Code→ID, Name→Destination) and replaced the plain
`length` text input with separate Nights and Days numeric steppers (default
3/3). The edit-trip component parses existing `"N nights / M days"` strings on
load and recombines them on submit — no API or schema changes required.

**Issues encountered & resolution:**
- `start` field stores ISO timestamps; the `type="date"` input requires
  `yyyy-MM-dd` — resolved by slicing `trip.start.substring(0, 10)` on load.
- `CurrencyPipe` and `DatePipe` must be explicitly imported in standalone
  components; added to `TripListingComponent` imports array.

**References:**
- PLAN.md: Phase 4 — Admin SPA: Complete & Verify
- docs/CS 465 Travlr Getaways Wireframe.pdf: WF-2, WF-5

---

## [2026-04-14] Phase 5 — Customer Auth (Backend)

**Change Type:** Feature
**Scope:** Phase 5 — Customer Auth

**Summary:**
Added customer-facing authentication backend to the Express public site.
Created `app-server/controllers/auth.js` with `loginPost`, `signupPost`, and
`logout` handlers that call the existing `POST /api/login` and
`POST /api/register` loopback endpoints and issue/clear an HttpOnly,
SameSite=Lax JWT cookie named `travlr-token`. Created
`app-server/routes/auth.js` mounting `POST /login`, `POST /signup`, and
`GET /logout`. Added session middleware to `app.js` that reads the cookie on
every request, verifies it with `JWT_SECRET`, and sets `res.locals.isLoggedIn`
and `res.locals.userName` for use in Handlebars views. Angular SPA auth
(localStorage + Bearer header) is unchanged. HBS views for `/login` and
`/signup` were deferred pending wireframe clarification (now resolved — see
Phase 5 Views below).

**Issues encountered & resolution:**
- ESLint not installed in node_modules — ran `npm install` to restore; lint
  exits with 0 errors (3 pre-existing warnings unchanged).

**References:**
- PLAN.md: Phase 5 — Customer Auth

---

## [2026-04-15] Phase 5 — Customer Auth (Views)

**Change Type:** Feature
**Scope:** Phase 5 — Customer Auth

**Summary:**
Completed the customer-facing auth UI. Added `loginGet` and `signupGet`
handlers to `app-server/controllers/auth.js`; wired `GET /login` and
`GET /signup` in `app-server/routes/auth.js`. Created `login.hbs` and
`signup.hbs` views following the existing `contact.hbs` table-form pattern
(`#contents > .box > .body`, table layout, `.txtfield` inputs, `.btn` submit).
Both views render an inline error message when `?error=` is present in the
query string. Updated `header.hbs` to show `Logout (userName)` when
`isLoggedIn` is truthy and `Login` otherwise, using the `res.locals` values
already set by the session middleware in `app.js`.

**Issues encountered & resolution:**

- None. Instructor clarified wireframes are not to be used, unblocking the
  views. Followed existing HBS patterns instead.

**References:**

- PLAN.md: Phase 5 — Customer Auth

---

## [2026-04-15] Phase 6 — Customer Experience (UI Fixes + Placeholder Routes)

**Change Type:** Feature
**Scope:** Phase 6 — Customer Experience (branch: `feature/ui-fixes`)

**Summary:**
Resolved all visible UI regressions and added the authenticated-customer
navigation features required by the project rubric.

### UI Fixes

**Nav bar overflow (LOGIN wrapping to second row)**
`#navigation li` had a fixed `width: 122px`; with 8 items (after adding
My Trips + Logout) the total exceeded the 860px container. Replaced the
float-based layout with CSS flexbox (`display: flex` on `#navigation ul`,
`flex: 1` on `li`), letting all items share the 860px equally with no
overflow or stray spacing.

**Login / signup form floating right**
Both `login.hbs` and `signup.hbs` were using `id="contact"`, inheriting
`#contact form { float: right; height: 320px }`. Changed both to `id="auth"`
and added a new `#auth` CSS block: centered container, `display: inline-block`
form, no fixed height.

**SEND sprite on auth buttons**
`#contact input.btn` used the `btn-send.png` sprite, overriding button text
and showing an empty image tile on the login/signup submit buttons. The new
`#auth input.btn` rule replaces the sprite with a solid teal background
(`#2c9688`) matching the site color scheme.

**Welcome greeting**
Added `#user-greeting` div in `header.hbs` that renders "Welcome, {{userName}}"
top-right when `isLoggedIn` is truthy. Added matching CSS (float right,
`margin-right: 49px`, `margin-top: 38px`).

**Logout overflow**
The logout nav item was "Logout ({{userName}})" — too wide for the flex tab.
Simplified to "Logout".

**nodemon not watching HBS files**
Created `nodemon.json` with `"ext": "js,json,hbs"` so template changes are
picked up without a manual server restart.

### New Placeholder Routes

**My Trips**
- `app-server/views/my-trips.hbs` — placeholder page with coming-soon message
- `app-server/controllers/customer.js` — `myTrips` handler
- `app-server/routes/customer.js` — `GET /my-trips`
- `app.js` — registered `customerRouter` before `/api`
- `header.hbs` — "My Trips" nav item visible only when `isLoggedIn`; supports
  active-state highlight via `navPage`

**Book Trip**
- `app-server/views/book-trip.hbs` — placeholder page displaying the trip code
  and contact link
- `app-server/controllers/customer.js` — `bookTrip` handler (renders with
  `tripCode` from URL param)
- `app-server/routes/customer.js` — `GET /book/:tripCode`
- `app-server/views/travel.hbs` — "Book Trip" button per card, guarded by
  `{{#if @root.isLoggedIn}}` (required to reach `res.locals` from inside the
  `{{#each trips}}` block); styled with `.btn-book` teal CSS class

**Issues encountered & resolution:**
- `{{#if isLoggedIn}}` inside `{{#each trips}}` silently evaluates to false
  because Handlebars shifts context to the current item. Fixed with
  `{{#if @root.isLoggedIn}}` to access the root `res.locals` scope.
- nodemon not reloading on `.hbs` changes — fixed with `nodemon.json`.
- Login/signup form floating right due to inherited `#contact` CSS — fixed by
  switching to `id="auth"` and new CSS block.

**References:**
- PLAN.md: Phase 6 — Customer Experience

---

## [2026-04-15] Phase 6 — Admin SPA UI Fixes (Bootstrap 5 + Polish)

**Change Type:** Fix
**Scope:** Phase 6 — Admin SPA (branch: `feature/ui-fixes`)

**Summary:**
Fixed all Bootstrap 4 → 5 regressions and visual polish issues in the
Angular admin SPA.

**Bootstrap 5 compatibility fixes:**
- `sr-only` → `visually-hidden` on the Trips nav link span; "(current)"
  was rendering as visible text.
- `data-toggle`/`data-target` → `data-bs-toggle`/`data-bs-target` on the
  hamburger button so mobile collapse works correctly.
- `card-deck` (removed in Bootstrap 5) stripped from `trip-listing`;
  replaced with Bootstrap 5 `row-cols-1 row-cols-md-3 g-3` grid.
- `form-group` (removed in Bootstrap 5) replaced with `mb-3` + `form-label`
  on both login form fields; added `mt-3` wrapper around Sign In button.

**Layout / styling fixes:**
- `navbar-end` (Bulma class, not Bootstrap) replaced with
  `navbar-nav ms-auto pe-3` inside `navbar-collapse` — Log In / Log Out
  now right-aligned with proper edge spacing.
- Email input missing `form-control` class added; now matches password
  field styling.
- Navbar logo constrained to `height="60"` to prevent full native-size
  render.
- `Add Trip` button wrapper given `my-3` margin for breathing room below
  the navbar.
- `h-100` added to `.card` for equal-height cards, plus `:host { display:
  flex; height: 100% }` in `trip-card.component.css` so the Angular
  component wrapper stretches to fill the grid column — without this the
  inner `h-100` had no reference height.

**New feature:**
- `getUserName()` added to `NavbarComponent` (reads name from JWT via
  `AuthenticationService.getCurrentUser()`). When logged in, navbar shows
  "Welcome, {name} | Log Out" instead of just "Log Out".

**Title fix:**
- `index.html` `<title>` corrected from "Travlr Gateways Admin" →
  "Travlr Getaways Admin".

**Files changed:**
`app-admin/src/app/navbar/navbar.component.html`,
`app-admin/src/app/navbar/navbar.component.ts`,
`app-admin/src/app/login/login.component.html`,
`app-admin/src/app/trip-listing/trip-listing.component.html`,
`app-admin/src/app/trip-card/trip-card.component.html`,
`app-admin/src/app/trip-card/trip-card.component.css`,
`app-admin/src/index.html`

**References:**
- PLAN.md: Phase 6 — Admin SPA UI Fixes

---

## [2026-04-16] Phase 7 — UI & Bug Fixes (branch: feature/phase-7-bugfixes)

**Change Type:** Fix
**Scope:** Admin SPA — add-trip, edit-trip, navbar; public-site logout verified

**What was done:**
- Added `mt-3` Bootstrap margin to the Save button in both `add-trip.component.html` and `edit-trip.component.html` so the button no longer sits flush against the last textarea.
- Injected `Router` into `NavbarComponent` and added `this.router.navigate(['/'])` after `authenticationService.logout()` so the admin SPA redirects to the trip list on logout instead of staying on the same page.
- Verified public-side logout (`GET /logout` in `app-server/controllers/auth.js`) already calls `res.redirect('/')` — no change required.

**Issues encountered & resolution:**
- None.

**References:**
- PLAN.md: Phase 7 — Hardening & Release
