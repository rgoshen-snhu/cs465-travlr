# Travlr Getaways — Requirements

- [Travlr Getaways — Requirements](#travlr-getaways--requirements)
  - [Document Control](#document-control)
  - [1. Purpose and Scope of This Document](#1-purpose-and-scope-of-this-document)
  - [2. Product Summary](#2-product-summary)
  - [3. Users and Stakeholders](#3-users-and-stakeholders)
    - [3.1 Traveler (Customer)](#31-traveler-customer)
    - [3.2 Administrator](#32-administrator)
    - [3.3 Platform Owner (Travlr Getaways)](#33-platform-owner-travlr-getaways)
  - [4. Goals](#4-goals)
  - [5. In Scope / Out of Scope](#5-in-scope--out-of-scope)
    - [5.1 In Scope](#51-in-scope)
    - [5.2 Deferred to Roadmap (§16)](#52-deferred-to-roadmap-16)
    - [5.3 Out of Scope](#53-out-of-scope)
  - [6. Assumptions](#6-assumptions)
  - [7. Functional Requirements](#7-functional-requirements)
    - [7.1 Customer-Facing Website](#71-customer-facing-website)
    - [7.2 Customer Accounts](#72-customer-accounts)
    - [7.3 Admin Console (Angular SPA)](#73-admin-console-angular-spa)
    - [7.4 API](#74-api)
    - [7.5 Authentication \& Authorization](#75-authentication--authorization)
  - [8. Non-Functional Requirements](#8-non-functional-requirements)
    - [8.1 Security](#81-security)
    - [8.2 Accessibility](#82-accessibility)
    - [8.3 Maintainability and Testability](#83-maintainability-and-testability)
    - [8.4 Portability](#84-portability)
    - [8.5 Performance (Pragmatic)](#85-performance-pragmatic)
  - [9. Data Requirements](#9-data-requirements)
    - [9.1 Existing Entities (in code)](#91-existing-entities-in-code)
    - [9.2 Entities Implied by the Scenario](#92-entities-implied-by-the-scenario)
    - [9.3 Entities Modeled in the SDD but Not in Scope for This Release](#93-entities-modeled-in-the-sdd-but-not-in-scope-for-this-release)
  - [10. Constraints](#10-constraints)
  - [11. Open Questions](#11-open-questions)
  - [12. Risks](#12-risks)
  - [13. Acceptance](#13-acceptance)
    - [13.1 Definition of Ready (per requirement)](#131-definition-of-ready-per-requirement)
    - [13.2 Definition of Done (per requirement)](#132-definition-of-done-per-requirement)
  - [14. Traceability](#14-traceability)
  - [15. Glossary](#15-glossary)
  - [16. Roadmap](#16-roadmap)
    - [16.1 Trip Detail Page](#161-trip-detail-page)
    - [16.2 Search and Filter](#162-search-and-filter)
    - [16.3 Customer Itineraries](#163-customer-itineraries)
    - [16.4 Reservations](#164-reservations)
    - [16.5 Admin — Customer Base Maintenance](#165-admin--customer-base-maintenance)


## Document Control

| Version | Date       | Author      | Status | Notes                                                                                                   |
|---------|------------|-------------|--------|---------------------------------------------------------------------------------------------------------|
| 0.1     | 2026-04-13 | Rick Goshen | Draft  | Initial requirements derived from the CS 465 client scenario, the existing SDD v1.1, and the codebase. |
| 0.2     | 2026-04-16 | Rick Goshen | Draft  | Moved unimplemented requirements to §16 Roadmap; renumbered §7 subsections accordingly.                 |

---

## 1. Purpose and Scope of This Document

This document captures the software requirements for the Travlr Getaways web application. It translates the client scenario (see `docs/Project Guidelines and Rubric.md`) and the design decisions already made in `docs/Travlr_Software_Design_Document_v2.md` into concrete, testable requirements.

Anything not grounded in the scenario, the SDD, the existing code, or the project's global engineering rules is listed under Section 11, **Open Questions**, rather than stated as a requirement.

Requirements not implemented in this release are tracked in Section 16, **Roadmap**.

---

## 2. Product Summary

Travlr Getaways is a travel booking web application. It has two user-facing surfaces that share one backend:

- A **customer-facing website** where travelers can create an account, browse trip packages, search packages by location and price, view upcoming itineraries, and book reservations.
- An **administrator single-page application (SPA)** where Travlr staff can maintain the customer base, available trip packages, and pricing.

The platform is built on the MEAN stack (MongoDB, Express, Angular, Node.js), as established in SDD §Executive Summary.

---

## 3. Users and Stakeholders

The client scenario identifies two user categories. Additional internal roles may be defined later, but only the following are in scope for this release.

### 3.1 Traveler (Customer)

- Creates an account on the Travlr site.
- Searches for trip packages by location and price point.
- Books reservations.
- Revisits the site before a trip to review their itinerary.

### 3.2 Administrator

- Maintains the customer base, trip packages, and pricing.
- Uses the admin SPA; must authenticate before any content changes.

### 3.3 Platform Owner (Travlr Getaways)

- Commissions the application and defines acceptance.
- Receives the finished product plus SDD as deliverables.

---

## 4. Goals

The goals below map directly to the rubric criteria in `docs/Project Guidelines and Rubric.md`.

- **G-1** Deliver a working customer-facing Express application structured with routes, controllers, views, and data models (MVC).
- **G-2** Render dynamic JSON trip data in the customer site using the Handlebars templating engine.
- **G-3** Store trip data in MongoDB via Mongoose, using schemas defined in the application.
- **G-4** Expose a RESTful API that the admin SPA and the customer site both consume.
- **G-5** Deliver an Angular SPA for administrators with rich, client-side interactivity.
- **G-6** Apply authentication (login form) and authorization (secure API endpoints) so that only authenticated administrators can modify data.

---

## 5. In Scope / Out of Scope

### 5.1 In Scope

- Public browsing of published trip packages.
- Customer account creation and authentication (from the client scenario).
- Admin CRUD of trip packages with pricing.
- JWT-based API authentication with secure endpoints for mutating operations.

### 5.2 Deferred to Roadmap (§16)

The following items are required by the client scenario but not implemented in this release:

- Search/filter of trips by location and price point.
- Customer ability to view their itineraries.
- Booking a reservation against a published trip.
- Admin management of the customer base.

### 5.3 Out of Scope

- Mobile native applications.
- Supplier / GDS integrations (Amadeus, Sabre, etc.).
- Multi-currency support, tax calculation, and regional pricing.
- Marketing automation (abandoned-cart emails, promotional campaigns).
- Real-world production deployment and associated operational tooling beyond what is needed for coursework demonstration.

---

## 6. Assumptions

- **A-1** The development and demonstration environment is a single developer workstation running Node.js, MongoDB, and the Angular dev server locally, consistent with SDD §Design Constraints.
- **A-2** Prices are stored and displayed in a single currency (USD assumed; confirm in §11).
- **A-3** Trip inventory is authored and maintained by Travlr staff; the system does not pull from external feeds.
- **A-4** Modern evergreen browsers (current Chrome, Firefox, Safari, Edge) are the supported targets.

---

## 7. Functional Requirements

Priorities use **MoSCoW**: `M` = Must, `S` = Should, `C` = Could. Priorities reflect what is needed to satisfy the rubric, the client scenario, and the existing SDD.

### 7.1 Customer-Facing Website

**FR-CAT-001 — Browse trips** `[M]`

The public site must display the available trip packages with the fields defined in the Trip model (code, name, length, start date, resort, per-person price, image, description).

- *Given* trip records exist in MongoDB, *when* a visitor loads the Travel page, *then* the trip list renders using Handlebars, drawing data from the REST API (rubric: Customer-Facing Website, Render Test Data).

> FR-CAT-002 (trip detail page), FR-CAT-003 (search/filter), and FR-CAT-004 (itinerary view) are deferred — see §16 Roadmap.

### 7.2 Customer Accounts

**FR-ACC-001 — Registration** `[M]`

A visitor can create a customer account by submitting name, email, and password through `POST /api/register`.

- Passwords are stored hashed and salted, never in plaintext (per `AI_RULES.md` §9 Security).
- On success, the server returns a JWT so the new user is authenticated without a separate login.

**FR-ACC-002 — Login** `[M]`

A registered customer can authenticate through `POST /api/login` using email and password.

- On success the server issues a JWT.
- On failure the server responds with `401` and a generic error message.

### 7.3 Admin Console (Angular SPA)

**FR-ADM-001 — Admin login** `[M]`

An administrator authenticates through the admin SPA login form. The SPA stores the issued JWT and attaches it to subsequent API calls (SDD §Sequence Diagram).

**FR-ADM-002 — List trips** `[M]`

An administrator sees a list of all trips retrieved from `GET /api/trips`.

**FR-ADM-003 — Create a trip** `[M]`

An administrator can create a new trip through the SPA, which sends `POST /api/trips` with the authenticated admin's JWT.

- All required Trip fields (code, name, length, start, resort, perPerson, image, description) must be provided.
- An unauthenticated request to the same endpoint is rejected with `401`.

**FR-ADM-004 — Edit a trip** `[M]`

An administrator can edit an existing trip through the SPA, which sends `PUT /api/trips/:tripCode` with the authenticated admin's JWT.

> FR-ADM-005 (customer base maintenance) is deferred — see §16 Roadmap.

### 7.4 API

**FR-API-001 — RESTful API surface** `[M]`

The backend exposes a RESTful API under `/api` that supports at minimum:

- `POST /register`, `POST /login` — authentication.
- `GET /trips`, `GET /trips/:tripCode` — public reads.
- `POST /trips`, `PUT /trips/:tripCode` — protected writes (JWT required).

**FR-API-002 — JSON contract** `[M]`

All API responses use JSON. Error responses include a `message` field suitable for display by the client.

### 7.5 Authentication & Authorization

**FR-AUTH-001 — JWT issuance** `[M]`

The server signs JWTs with a secret configured via the `JWT_SECRET` environment variable (see `.env.example`).

**FR-AUTH-002 — Endpoint protection** `[M]`

Mutating `/api/trips` endpoints require a valid JWT. Missing, expired, or invalid tokens return `401` (rubric: Security).

**FR-AUTH-003 — Credentials are never persisted in plaintext** `[M]`

Per `AI_RULES.md` §9, passwords are stored hashed and salted.

---

## 8. Non-Functional Requirements

These NFRs are scoped to what the project's global engineering rules (`AI_RULES.md`) require and what the SDD already commits to.

### 8.1 Security

- **NFR-SEC-001** All user input is validated at the API boundary; output rendered in Handlebars and Angular is escaped by default (`AI_RULES.md` §9).
- **NFR-SEC-002** No secrets, credentials, or PII are written to source control or to application logs.
- **NFR-SEC-003** Passwords are stored hashed and salted.
- **NFR-SEC-004** `JWT_SECRET` is supplied through environment configuration; `.env` is gitignored.

### 8.2 Accessibility

- **NFR-A11Y-001** Customer-facing pages follow WCAG 2.1 AA (`AI_RULES.md` §1): semantic landmarks, labeled form controls, keyboard operability, and sufficient colour contrast.

### 8.3 Maintainability and Testability

- **NFR-MAINT-001** Code follows the existing MVC structure: routes wire URLs to controllers, controllers fetch data via the API, views render HBS templates.
- **NFR-MAINT-002** Changed code meets ≥ 80% unit test coverage (`AI_RULES.md` §3).
- **NFR-MAINT-003** Changes follow strict TDD (Red → Green → Refactor) per `AI_RULES.md` §1.
- **NFR-MAINT-004** Commits follow Conventional Commits on a GitFlow branching model (`AI_RULES.md` §2).

### 8.4 Portability

- **NFR-PORT-001** The server reads configuration from environment variables (`PORT`, `DB_HOST`, `JWT_SECRET`) and falls back to sensible local defaults, so the app runs without bespoke setup on a developer workstation.

### 8.5 Performance (Pragmatic)

- **NFR-PERF-001** The trip list and trip detail endpoints return quickly enough to support an interactive demo on local hardware. No numeric SLO is set for this release; see Open Question Q-3.

---

## 9. Data Requirements

### 9.1 Existing Entities (in code)

- **Trip** (`app-api/models/travlr.js`) — `code`, `name`, `length`, `start` (Date), `resort`, `perPerson`, `image`, `description`. All required; `code` and `name` indexed.
- **User** (`app-api/models/user.js`) — account record for customers and (initially) administrators. Exact schema is defined in code.

### 9.2 Entities Implied by the Scenario

- **Booking** — ties a customer to a trip with whatever reservation details the booking flow captures. Not yet in the codebase; needed to satisfy FR-BK-001 and FR-CAT-004 (see §16 Roadmap). Detailed schema is an Open Question (Q-4).

### 9.3 Entities Modeled in the SDD but Not in Scope for This Release

The SDD's Class Diagram introduces `Itinerary`, `FlightInfo`, `HotelInfo`, `CruiseInfo`, `TravellerInfo`, `MemberAccount`, `Travel_Agent`, `Membership_Admin`, and `HotelBooking / FlightBooking / CruiseBooking`. These represent a future, richer domain model. They are not required to satisfy the rubric for this release and should be treated as design reference rather than build targets.

---

## 10. Constraints

- **C-1** The technology stack is fixed to MEAN (SDD §Executive Summary).
- **C-2** The customer-facing site is server-rendered via Handlebars; the admin interface is an Angular SPA (SDD §Component Diagram).
- **C-3** Both surfaces share one Express backend and one MongoDB database (SDD §Design Constraints).
- **C-4** The project is delivered as coursework for CS 465; the submission artifact is a zipped `travlr.zip` of the repository plus the SDD.

---

## 11. Open Questions

These items are unresolved and should be confirmed with the client (or course instructor) before the corresponding requirements are treated as final.

- **Q-1 — Payment processing for bookings.** The scenario says customers "book reservations" but does not specify whether payment capture is part of the flow. Assumption: booking persists a reservation record without collecting payment. To confirm.
- **Q-2 — Scope of "customer base maintenance" for admins.** View-only, edit, deactivate, delete? To confirm.
- **Q-3 — Performance targets.** No SLOs are specified by the scenario or SDD. Pragmatic targets can be set if the client requires them.
- **Q-4 — Booking data model.** What fields must a booking capture (start date, traveler count, rooms, notes)? Cancellation rules?
- **Q-5 — Admin role model.** The scenario refers to "administrators" singularly. Do we need separate Editor / SuperAdmin roles, or is a single admin role sufficient?
- **Q-6 — Itinerary detail.** What should "see their itineraries" show beyond the trips they have booked (e.g., day-by-day plan, documents, travel dates countdown)?

---

## 12. Risks

| Risk                                                                           | Likelihood | Impact | Mitigation                                                                                 |
|--------------------------------------------------------------------------------|------------|--------|--------------------------------------------------------------------------------------------|
| Booking flow scope grows (payments, refunds) beyond what the scenario requires | Medium     | High   | Treat Q-1 as a decision gate before implementation; keep booking flow minimal unless confirmed. |
| Admin and customer auth share the User model and drift apart                   | Medium     | Medium | Introduce a role field early; decide on role model (Q-5) before the admin hardening phase. |
| SDD Class Diagram tempts scope expansion into Itineraries / Bookings sub-types | Medium     | Medium | Explicitly treat those classes as future-state per §9.3 unless the client reopens scope.   |
| Dual rendering strategies (HBS + Angular) double the surface area for changes  | Medium     | Medium | Centralize shared concerns in the API; avoid duplicating presentation logic in both surfaces. |

---

## 13. Acceptance

### 13.1 Definition of Ready (per requirement)

- Clear, testable acceptance criteria.
- Dependencies and open questions identified.
- NFR implications noted (security, accessibility, testability).

### 13.2 Definition of Done (per requirement)

- Unit and, where applicable, integration tests pass in CI.
- Lint and static analysis are clean.
- Documentation updated (`README.md`, SDD, or an ADR if a design decision changed).
- Manually verified against acceptance criteria on a local environment.

---

## 14. Traceability

| Requirement set | Source                                                                                |
|-----------------|---------------------------------------------------------------------------------------|
| G-1..G-6        | `docs/Project Guidelines and Rubric.md` — Directions and Rubric                       |
| FR-CAT-*, FR-ACC-*, FR-ADM-*, FR-API-*, FR-AUTH-* | Client scenario in the Rubric doc + existing code in `app-api/` and `app-admin/` |
| NFR-SEC-*, NFR-A11Y-*, NFR-MAINT-*  | `~/.claude/CLAUDE.md` (`AI_RULES.md`)                                |
| C-1..C-3        | `docs/Travlr_Software_Design_Document_v2.md` — Executive Summary and Design Constraints |
| §9.3 (deferred entities) | SDD Class Diagram                                                            |

---

## 15. Glossary

- **MEAN stack** — MongoDB, Express, Angular, Node.js.
- **SPA** — Single-page application; the admin console in this product.
- **JWT** — JSON Web Token, used for API authentication.
- **MVC** — Model-View-Controller, the architectural pattern used on the customer-facing Express site.
- **MoSCoW** — Prioritization scheme: Must, Should, Could, Won't.

---

## 16. Roadmap

The following requirements are defined by the client scenario but were not implemented in this release. They are tracked here for future development.

### 16.1 Trip Detail Page

**FR-CAT-002 — Trip detail** `[S]`

A visitor can view the full detail of a single trip, addressable by its trip code.

- Data source: `GET /api/trips/:tripCode`.
- Requires a new public route (`GET /travel/:tripCode`), controller handler, and HBS view.

### 16.2 Search and Filter

**FR-CAT-003 — Search by location and price** `[M]`

A visitor can narrow the list of trips by location and by price point.

- Required by the client scenario.
- Acceptance: applying location and/or price filters updates the displayed trip list without requiring full page reloads.
- Implementation note: the API `GET /api/trips` will need to support optional query parameters (e.g. `?resort=` and `?maxPrice=`); the HBS travel page will need a filter form.

### 16.3 Customer Itineraries

**FR-CAT-004 — View itineraries** `[S]`

A logged-in traveler can view their upcoming itineraries (the trips they have booked).

- Required by the client scenario.
- Depends on FR-BK-001 (booking persistence). The `/my-trips` route currently renders a placeholder page.

### 16.4 Reservations

**FR-BK-001 — Book a reservation** `[M]`

A logged-in customer can book a reservation against a published trip package.

- Required by the client scenario.
- The booking must persist in MongoDB and be associated with the customer who made it.
- Requires a new `Booking` Mongoose model (see §9.2 and Open Question Q-1 and Q-4).
- The `/book/:tripCode` route currently renders a placeholder page.

**FR-BK-002 — Booking confirmation view** `[S]`

After booking, the customer sees a confirmation with the trip details and a reference they can use to identify the booking in their itinerary list.

- Depends on FR-BK-001.

### 16.5 Admin — Customer Base Maintenance

**FR-ADM-005 — Customer base maintenance** `[S]`

An administrator can view and manage the customer accounts maintained by the application.

- Required by the client scenario ("maintain a customer base").
- Scope of "manage" (edit, deactivate, delete) is captured as Open Question Q-2.
- Requires new admin SPA components (Users list, user detail/edit) and corresponding API endpoints.
