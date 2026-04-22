# Travlr Getaways

A full-stack travel booking demo built for **SNHU CS-465 Full Stack Development**. Travlr serves a customer-facing site rendered with Express + Handlebars and an administrator single-page application (Angular 17) that manages trips through a shared JSON API backed by MongoDB.

- [Travlr Getaways](#travlr-getaways)
  - [Journal](#journal)
    - [Architecture](#architecture)
    - [Functionality](#functionality)
    - [Testing](#testing)
    - [Reflection](#reflection)
  - [Screenshots](#screenshots)
  - [Architecture](#architecture-1)
  - [Tech Stack](#tech-stack)
  - [Prerequisites](#prerequisites)
  - [Configuration](#configuration)
  - [Getting Started](#getting-started)
    - [1. Install dependencies](#1-install-dependencies)
    - [2. Seed the database (optional, first run)](#2-seed-the-database-optional-first-run)
    - [3. Run the server](#3-run-the-server)
    - [4. Run the admin SPA](#4-run-the-admin-spa)
  - [API Reference](#api-reference)
  - [Admin SPA Routes](#admin-spa-routes)
  - [Public Site Routes](#public-site-routes)
  - [Testing](#testing-1)
  - [Project Structure](#project-structure)
  - [Troubleshooting](#troubleshooting)
  - [License](#license)

## Journal

### Architecture

The customer side uses the classic MVC pattern, with Express controllers, Handlebars views, and Mongoose models rendering a full HTML page on every request. There isn't much client-side JavaScript beyond form validation. The admin side is an Angular single-page application that loads once and then talks to the REST API over JSON. State on the customer side lives server-side, so once I dropped `isLoggedIn` into session middleware it was available everywhere. In the SPA, state lives in services and login comes from a JWT pulled out of `localStorage`. Same user, two different mental models.

MongoDB paid off on the news feature. The seed data had three differently-shaped sections. Blog posts, press releases, and media mentions, each with different fields. I normalized them into one `NewsArticle` collection with an `articleType` discriminator. Easy in Mongo. In Postgres it would've meant awkward joins or JSONB columns.

### Functionality

JSON is where the stack meets. The syntax is a subset of JavaScript, but it's a serialization format, not a language. You can't put a function in it. JSON crosses the wire between Angular and Express, and Mongoose turns it into BSON for storage. A field name mismatch bit me on the news page. My `NewsArticle` schema stored `publishedAt`, but the Handlebars template expected `date`, so I mapped the name in the controller rather than touch the template.

Phase 3 rewired all four public-site controllers to fetch from the API loopback instead of flat JSON files. Once I had the pattern in `travel.js`, the other three were copies, and in hindsight I should've pulled out a `fetchFromApi` helper. Angular made reuse cleaner. The `trip-card` component renders one trip, and the listing iterates. Reuse pays off when something needs to change. A visual tweak becomes a one-file edit instead of a template hunt, and new features ship faster because the pieces are already there.

### Testing

Testing meant Postman and the browser, since CS-465 doesn't use Jest or Mocha. Public GETs like `/api/rooms` were the easy case. Hit the endpoint, check the shape and status. Security made it harder because I ran two auth models in the same project. The customer side uses an HttpOnly `travlr-token` cookie, while the admin SPA uses a Bearer token in the `Authorization` header. That meant two different Postman setups for the same protected endpoint, one per client. Protected POST and PUT routes need the right credential attached, and when the wrong kind slips through, nothing breaks visibly. The request just silently does the wrong thing. That's how my admin interceptor got away with attaching Bearer tokens to the login request for weeks.

### Reflection

The biggest change I'd make if I started over is testing the auth flow end-to-end earlier. I inherited four separate bugs in the admin login and didn't find them until I'd already built features on top of auth I assumed worked. That's the kind of mistake I won't make twice.

The main career skill I'm taking from this is Angular itself. This was my first real project in it, and the component model transfers more from React than I expected. Pairing Angular with the Node and Express work I already do on the HSES platform gives me a full-stack JavaScript story I didn't have before. The habit I'm keeping is setting up the tooling gate on day one with ESLint, Prettier, and markdownlint. Skipping that step is how codebases get messy quietly. I still want to rebuild the auth layer with refresh tokens and short-lived access tokens, since the single-token approach I shipped works for a class project but isn't how production handles session lifecycle.

## Screenshots

**Admin SPA — Trip List (authenticated)**
![Admin SPA trip list](./docs/images/spa_03_trip_list_authenticated.png)

**Admin SPA — Edit Trip**
![Admin SPA edit trip](./docs/images/spa_07_edit_trip.png)

## Architecture

- **Pattern**: Dual-app monolith. One Node/Express process hosts the public website and a REST API under `/api`. The public site follows the **Model–View–Controller (MVC)** pattern: Mongoose schemas in `app-api/models/` act as the Model layer, Handlebars templates in `app-server/views/` are the Views, and `app-server/controllers/` contain the Controllers that bridge them. A separate Angular SPA (`app-admin/`) is developed independently and consumes the API over CORS.
- **Key boundaries**:
  - `app-server/` — MVC-structured public site: `routes/` wire URLs to `controllers/`, which render `views/` (Handlebars).
  - `app-api/` — REST API: `routes/`, `controllers/`, Mongoose `models/`, Passport `config/`.
  - `app-admin/` — Angular 17 admin SPA (trip listing, add, edit, login).
  - `public/` — static assets served by Express.
  - `data/` — JSON seed fixtures used by `app-api/models/seed.js`.
- **Data flow**:

```text
Browser (public site)  ──►  Express routes ──► app-server controllers ──► HTTP loopback ──► /api ──► Mongoose models ──► MongoDB
                                                      │
                                                      └─► Handlebars views (rendered HTML)

Browser (admin SPA)    ──►  Angular dev server (:4200) ─────────────────► /api (:3000) ──► MongoDB
```

- **Auth**: JWT issued by `POST /api/login` (or `/register`). Mutating trip endpoints (`POST /api/trips`, `PUT /api/trips/:tripCode`) require a `Bearer` token; read endpoints are public.

## Tech Stack

| Layer        | Technology                                          |
| ------------ | --------------------------------------------------- |
| Server       | Node.js, Express 4, Handlebars (`hbs`)              |
| API          | Express router, Passport (local), jsonwebtoken      |
| Database     | MongoDB via Mongoose 9                              |
| Admin SPA    | Angular 17, Bootstrap 5, RxJS                       |
| Dev tooling  | nodemon, dotenv, Karma/Jasmine (Angular tests)      |

## Prerequisites

- Node.js 18+ and npm
- MongoDB running locally on `127.0.0.1:27017` (or a reachable host set via `DB_HOST`)
- Angular CLI 17 (installed as a dev dependency in `app-admin/`)

## Configuration

An `.env.example` file is tracked in the repo root as a template. Copy it to `.env` and replace the placeholder values — `.env` itself is gitignored so secrets stay local.

```bash
# From the project root
cp .env.example .env

# Generate a strong JWT signing key and substitute it into .env
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Copy the output and replace `replace-with-a-long-random-string` in .env
```

Variables defined in `.env.example`:

- `PORT` — port for the Express server (defaults to `3000` if unset).
- `DB_HOST` — MongoDB `host:port` (defaults to `127.0.0.1:27017`; the database name is always `travlr`).
- `JWT_SECRET` — signing key for JWT access tokens; required for login and protected routes. **Replace** the placeholder before running the server.

## Getting Started

### 1. Install dependencies

```bash
# Backend / public site (from repo root)
npm install

# Admin SPA
cd app-admin && npm install
```

### 2. Seed the database (optional, first run)

```bash
npm run seed
```

Loads fixtures from `data/` into the `travlr` database.

### 3. Run the server

```bash
npm run dev     # nodemon, auto-reload
# or
npm start       # plain node
```

The public site is available at `http://localhost:3000` and the API at `http://localhost:3000/api`.

### 4. Run the admin SPA

```bash
cd app-admin
ng serve       # ng serve → http://localhost:4200
```

The Admin site is available at `http://localhost:4200`.
The Angular app is configured (in `src/app/services/trip-data.service.ts`) to call the API at `http://localhost:3000/api`. CORS is enabled server-side for `http://localhost:4200` in `app.js`.

## API Reference

All endpoints are prefixed with `/api`.

| Method | Path                    | Auth     | Description                                        |
| ------ | ----------------------- | -------- | -------------------------------------------------- |
| POST   | `/register`             | Public   | Create a new customer user, returns JWT            |
| POST   | `/login`                | Public   | Authenticate, returns JWT                          |
| GET    | `/trips`                | Public   | List all trips                                     |
| POST   | `/trips`                | Bearer   | Create a new trip                                  |
| GET    | `/trips/:tripCode`      | Public   | Fetch a trip by its code                           |
| PUT    | `/trips/:tripCode`      | Bearer   | Update a trip by its code                          |
| GET    | `/rooms`                | Public   | List all room types                                |
| GET    | `/meals`                | Public   | List all meals                                     |
| GET    | `/news`                 | Public   | List all news articles (optional `?type=` filter)  |
| GET    | `/home`                 | Public   | Fetch the home page content document               |

Protected requests must include an `Authorization: Bearer <token>` header.

> **Note:** Admin accounts are seeded — run `npm run seed` to create `admin@travlr.com / Admin1234!`. Customer accounts are self-registered via `POST /api/register` or the `/signup` page.

## Admin SPA Routes

| Path          | Component              | Purpose                       |
| ------------- | ---------------------- | ----------------------------- |
| `/`           | `TripListingComponent` | Browse trips                  |
| `/add-trip`   | `AddTripComponent`     | Create a trip (auth required) |
| `/edit-trip`  | `EditTripComponent`    | Edit a trip (auth required)   |
| `/login`      | `LoginComponent`       | Authenticate                  |

A JWT interceptor attaches the stored token to outbound API calls; a `Storage` wrapper centralizes `localStorage` access for the admin shell.

## Public Site Routes

| Method | Path                | Auth            | Description                                  |
| ------ | ------------------- | --------------- | -------------------------------------------- |
| GET    | `/`                 | Public          | Home page                                    |
| GET    | `/travel`           | Public          | Browse all trip packages                     |
| GET    | `/rooms`            | Public          | Room types listing                           |
| GET    | `/meals`            | Public          | Meals listing                                |
| GET    | `/news`             | Public          | News and travel tips                         |
| GET    | `/contact`          | Public          | Contact form page                            |
| GET    | `/login`            | Public          | Customer login form                          |
| POST   | `/login`            | Public          | Authenticate; sets HttpOnly JWT cookie       |
| GET    | `/signup`           | Public          | Customer registration form                   |
| POST   | `/signup`           | Public          | Register new customer; sets HttpOnly JWT cookie |
| GET    | `/logout`           | Public          | Clear session cookie; redirect to `/`        |
| GET    | `/my-trips`         | Cookie (JWT)    | Customer itineraries placeholder             |
| GET    | `/book/:tripCode`   | Cookie (JWT)    | Book a trip placeholder                      |

## Testing

```bash
# Angular unit tests (Karma + Jasmine)
cd app-admin && npm test
```

The backend does not ship with an automated test suite; manual verification follows the acceptance criteria documented per module.

## Project Structure

```text
CS465-travlr/
├── app.js                  # Express bootstrap, view engine, routes, CORS, errors
├── bin/www                 # HTTP server entry point
├── app-server/             # Public site (MVC)
│   ├── controllers/        # Controllers (travel, rooms, meals, news, ...)
│   ├── routes/             # Routers wiring URLs to controllers
│   └── views/              # Handlebars views + partials + layouts
├── app-api/                # REST API
│   ├── routes/index.js     # /api router with JWT guard
│   ├── controllers/        # trips, authentication
│   ├── models/             # Mongoose schemas (travlr, user), db.js, seed.js
│   └── config/passport.js  # Local strategy
├── app-admin/              # Angular 17 admin SPA
│   └── src/app/            # components, services, models, guards
├── data/                   # JSON seed fixtures
├── public/                 # static assets
└── package.json
```

## Troubleshooting

- **`Mongoose connection error`** — confirm MongoDB is running and `DB_HOST` resolves; `db.js` retries once after 1s then logs errors.
- **`401 Unauthorized` on POST/PUT `/trips`** — client is missing `Authorization: Bearer <token>` or `JWT_SECRET` differs between the issuer and verifier.
- **CORS errors from the admin SPA** — the CORS allow-origin in `app.js` is hard-coded to `http://localhost:4200`; update it if you serve Angular on a different port.
- **`EADDRINUSE`** — another process holds `PORT`; change the port or stop the other process.

## License

MIT — see [LICENSE](./LICENSE).
