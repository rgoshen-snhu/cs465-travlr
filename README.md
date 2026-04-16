# Travlr Getaways

A full-stack travel booking demo built for **SNHU CS-465 Full Stack Development**. Travlr serves a customer-facing site rendered with Express + Handlebars and an administrator single-page application (Angular 17) that manages trips through a shared JSON API backed by MongoDB.

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
