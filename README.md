# ReWear — Sustainable Clothing Reuse, Exchange & Donation Platform

A full-stack web application that lets people give unused clothes a second life by
**listing, exchanging, donating and requesting clothing items** instead of throwing them
away. Built as an SDG-focused PBL project (SDG 12 — Responsible Consumption and
Production, SDG 13 — Climate Action).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, JavaScript (JSX), React Router 6, Bootstrap 5 + Bootstrap Icons, Axios |
| Backend | Node.js, Express 4, MongoDB via Mongoose 8 |
| Auth | JWT (`jsonwebtoken`) + password hashing (`bcryptjs`) |
| Uploads | Multer 2 (image upload, 2 MB limit, JPG/JPEG/PNG/WEBP only) |
| Dev tooling | Nodemon, Concurrently, dotenv, CORS |

---

## Features

**Public**
- Browse/search clothing items with filters (keyword, category, size, condition, type, gender, location)
- Item detail pages with owner info and request actions
- Live platform impact metrics (`/impact`)
- About / How It Works pages

**Authenticated users**
- Register, login, JWT-based session (`/auth/me`)
- Profile view/update (password never returned)
- List items for **Donation** or **Exchange** (with optional image upload)
- Edit / delete own listings
- Dashboard with personal impact stats (`/users/impact`)
- Send exchange requests (with an offered item) or donation requests
- Accept / reject / cancel / complete requests — full lifecycle
- Track own requests, incoming requests, exchanges and donations

**Admin**
- Admin dashboard with platform statistics
- User management (activate / deactivate, remove)
- Item management (soft-remove: status → `Removed`, hidden from public browse)
- Request moderation (all platform requests with filters)

**Request lifecycle (server-enforced)**

```
create ──► Pending ──owner──► Accepted ──either party──► Completed
             │  ▲                  │
        owner│  │requester      owner│
             ▼  │                  ▼
          Rejected             Cancelled
```

- Donation completed → item status `Donated`
- Exchange completed → both items `Exchanged`
- Reject/cancel → item released back to `Available`
- Impact Score = completed exchanges + completed donations (project-defined metric)

---

## Prerequisites

- Node.js 18+
- MongoDB running locally on `mongodb://127.0.0.1:27017` (or a connection string of your own)

## Setup

```bash
# 1. install dependencies for root, server and client
npm run install:all

# 2. configure environment (optional — dev fallbacks are built in)
copy .env.example server\.env        # Windows
# cp .env.example server/.env        # macOS/Linux

# 3. seed the database with demo users, items and requests
npm run seed

# 4. run both server and client together
npm run dev
```

- Frontend: **http://localhost:5173**
- Backend API: **http://localhost:5000/api**
- Health check: **http://localhost:5000/api/health**

Other scripts:

```bash
npm run server     # backend only (nodemon)
npm run client     # frontend only (vite)
npm run build      # production build of the client (client/dist)
npm run start      # production server start
```

## Environment Variables

Defined in `server/.env` (see `server/.env.example` / `.env.example`).
Never commit a real `.env` file — `.gitignore` already excludes it.

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `5000` | API port |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/rewear` | MongoDB connection |
| `JWT_SECRET` | dev fallback (warning logged) | Token signing secret |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime |
| `CLIENT_URL` | `*` | CORS origin |

## Test Accounts (after `npm run seed`)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@rewear.test` | `Admin@123` |
| User | `aarav@rewear.test` | `Password@123` |
| User | `diya@rewear.test` | `Password@123` |
| User | `rohan@rewear.test` | `Password@123` |

---

## Project Structure

```
ReWear/
├── package.json              # root scripts (dev/build/seed/install:all)
├── .env.example
├── .gitignore
├── docs/
│   └── ReWear_PBL_Report.md  # PBL report + verified test log
├── client/                   # React + Vite frontend
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx           # all 22 routes + guards
│       ├── main.jsx
│       ├── index.css         # green SDG theme
│       ├── components/       # Navbar, ItemCard, FilterBar, RequestModal, guards...
│       ├── layouts/          # MainLayout
│       ├── pages/            # Home, Browse, ItemDetails, Dashboard, Impact...
│       │   └── admin/        # AdminDashboard/Users/Items/Requests
│       ├── context/          # AuthContext (JWT in localStorage)
│       ├── hooks/            # useDocumentTitle
│       ├── services/api.js   # single Axios instance + interceptor
│       └── utils/            # constants, helpers
└── server/                   # Express + MongoDB API
    ├── server.js             # app entry
    ├── config/               # env.js, db.js
    ├── models/               # User, Item, Request
    ├── controllers/          # auth, item, request, user, admin, health
    ├── routes/               # auth, item, request, user, admin, health
    ├── middleware/           # auth (JWT), upload (multer), error
    ├── services/statsService.js
    ├── utils/                # generateToken, response helpers
    ├── scripts/seed.js       # idempotent demo data
    └── uploads/              # user-uploaded images
```

## API Modules

| Module | Endpoints |
|---|---|
| Health | `GET /api/health`, `GET /api/impact` |
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Items | `GET /api/items` (filters: `search,category,size,condition,type,gender,location`), `GET /api/items/:id`, `POST /api/items`, `PUT /api/items/:id`, `DELETE /api/items/:id` |
| Requests | `POST /api/requests`, `GET /api/requests/my`, `GET /api/requests/incoming`, `GET /api/requests/:id`, `PUT /api/requests/:id/accept\|reject\|cancel\|complete` |
| Users | `GET /api/users/profile`, `PUT /api/users/profile`, `GET /api/users/impact` |
| Admin | `GET /api/admin/stats`, `GET /api/admin/users`, `PUT /api/admin/users/:id/toggle-status`, `DELETE /api/admin/users/:id`, `GET /api/admin/items`, `DELETE /api/admin/items/:id`, `GET /api/admin/requests` |

All authenticated endpoints use `Authorization: Bearer <token>`.
Admin endpoints require `role === 'admin'`.

## Data Models

- **User** — name, email (unique), password (hashed, stripped from JSON), role (`user`/`admin`), isActive
- **Item** — owner, title, description, category, size, condition, gender, image, location, type (`Donation`/`Exchange`), status (`Available`/`Requested`/`Accepted`/`Exchanged`/`Donated`/`Removed`)
- **Request** — item, requester, owner, type, message, offeredItem (for exchanges), status (`Pending`/`Accepted`/`Rejected`/`Cancelled`/`Completed`)

## Testing

See **`docs/ReWear_PBL_Report.md`** for the full, honest test log: every result recorded
there was actually executed against the running application (auth, item CRUD, filters,
request lifecycle, admin actions, uploads, health/build checks). Features verified only
by source inspection are labelled as such.

## SDG Alignment

- **SDG 12 — Responsible Consumption & Production**: extends garment lifecycles through reuse, exchange and donation.
- **SDG 13 — Climate Action**: reduces demand for new clothing production by making second-hand sharing convenient.

Environmental benefit is presented through project-defined counters (items exchanged,
donated, impact score) — no unsupported emissions statistics are claimed.
