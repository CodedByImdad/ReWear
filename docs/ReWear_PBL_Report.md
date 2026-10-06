# ReWear — PBL Project Report

**Project:** ReWear — Sustainable Clothing Reuse, Exchange and Donation Platform
**SDG focus:** SDG 12 (Responsible Consumption & Production) and SDG 13 (Climate Action)
**Stack:** React 18 + Vite (frontend) · Express + MongoDB (backend) · JWT authentication
**Repository location:** `E:\Project\WAD_Project\ReWear`

---

## 1. Problem Statement

Clothing waste is a growing problem: people discard garments that are still wearable,
while others need affordable clothing. Existing solutions are either commercial
marketplaces (profit-driven, complex) or donation drives (one-way, infrequent). There is
no simple, friendly web platform where a community can exchange and donate clothing
directly with full transparency over request status.

## 2. Proposed Solution

ReWear is a community platform where users:

1. List unused clothing as **Donation** (free) or **Exchange** (swap).
2. Browse and filter available items.
3. Send requests — exchange requests must attach one of the requester's own available items.
4. Track every request through a server-enforced lifecycle
   (`Pending → Accepted → Completed`, or `Rejected` / `Cancelled`).
5. See live, project-defined impact counters for the platform and for themselves.

Admins moderate users, items and requests from a dedicated admin area.

## 3. Objectives

- Full-stack implementation with role-based access (guest / user / admin).
- Server-side validation and state-machine enforcement for all exchange/donation flows.
- Secure auth (JWT + bcrypt), safe file uploads, no secrets committed.
- Responsive Bootstrap 5 UI with a consistent green sustainability theme.

## 4. System Design

### 4.1 Architecture

```
React SPA (Vite, port 5173)
   │  Axios (JWT interceptor, 401 → logout)
   ▼
Express REST API (port 5000, /api/*)
   │  controllers → models → MongoDB (rewear DB, port 27017)
   ├── middleware: auth (protect / optionalAuth / adminOnly), multer upload, error handler
   └── static: /uploads (item images)
```

### 4.2 Data models

| Model | Key fields | Notes |
|---|---|---|
| **User** | name, email (unique), password, role (`user`/`admin`), isActive | bcrypt hash in pre-save hook; `toJSON()` strips password |
| **Item** | owner, title, description, category, size, condition, gender, image, location, type (`Donation`/`Exchange`), status | status enum: `Available, Requested, Accepted, Exchanged, Donated, Removed` |
| **Request** | item, requester, owner, type, message, offeredItem, status | status enum: `Pending, Accepted, Rejected, Cancelled, Completed` |

### 4.3 Request state machine (enforced server-side)

| Action | Actor | Allowed from | Effect |
|---|---|---|---|
| create | requester (≠ owner) | item `Available` | request `Pending`, item → `Requested`; exchange requires requester's own `Available` `offeredItem`; duplicate open request rejected |
| accept | item owner | `Pending` | request → `Accepted` |
| reject | item owner | `Pending` | request → `Rejected`, item → `Available` |
| cancel | requester | `Pending`/`Accepted` | request → `Cancelled`, item → `Available` |
| complete | requester or owner | `Accepted` | request → `Completed`; donation → item `Donated`; exchange → both items `Exchanged` |

### 4.4 Security measures

- Passwords hashed with bcrypt; password field removed from every JSON response.
- JWT bearer auth (`protect`) with `isActive` check → deactivated accounts get 403.
- Admin routes require `role === 'admin'`.
- Ownership checks on item edit/delete and every request transition.
- Multer: JPG/JPEG/PNG/WEBP only, 2 MB limit, generated filenames, upload directory outside the client bundle.
- CORS configurable via `CLIENT_URL`; central error handler hides stack traces.
- `.env` excluded by `.gitignore` and by the release ZIP; dev fallbacks log a `JWT_SECRET` warning instead of failing.

### 4.5 Frontend routes (22)

Public: `/`, `/about`, `/how-it-works`, `/browse`, `/item/:id`, `/impact`, `/login`, `/register`, `*` (404)
User (protected): `/dashboard`, `/profile`, `/my-listings`, `/add-item`, `/edit-item/:id`, `/my-requests`, `/incoming-requests`, `/my-exchanges`, `/my-donations`
Admin (guarded): `/admin`, `/admin/users`, `/admin/items`, `/admin/requests`

## 5. API Modules

| Module | Endpoints |
|---|---|
| Health | `GET /api/health`, `GET /api/impact` |
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Items | `GET /api/items` (filters: `search,category,size,condition,type,gender,location`), `GET /api/items/:id`, `POST /api/items` (multipart `image`), `PUT /api/items/:id`, `DELETE /api/items/:id` |
| Requests | `POST /api/requests`, `GET /api/requests/my`, `GET /api/requests/incoming`, `GET /api/requests/:id`, `PUT /api/requests/:id/accept`, `.../reject`, `.../cancel`, `.../complete` |
| Users | `GET /api/users/profile`, `PUT /api/users/profile`, `GET /api/users/impact` |
| Admin | `GET /api/admin/stats`, `GET /api/admin/users`, `PUT /api/admin/users/:id/toggle-status`, `DELETE /api/admin/users/:id`, `GET /api/admin/items`, `DELETE /api/admin/items/:id` (soft-remove), `GET /api/admin/requests` |

## 6. SDG Alignment

- **SDG 12**: extends garment lifecycles (reuse/repair/rehome instead of landfill).
- **SDG 13**: less demand for new clothing production → lower resource use.
- Impact metrics shown to users: items listed, exchanges completed, donations completed,
  and a clearly labelled **project-defined** `impactScore = completedExchanges + completedDonations`.
  No unsupported emissions/CO₂ statistics are claimed anywhere in the product.

---

## 7. Testing — Verified Results

> **Honesty rule:** every line in this section was executed against the running
> application during this session and observed to return the recorded result.
> Features that were only inspected in source code are listed separately in §8.

### 7.1 Environment & build

| # | Test | Method | Result |
|---|---|---|---|
| 1 | Frontend production build | `npm run build` (vite) | **PASS** — 133 modules, `dist/assets/index-Dl2MrnhV.js` 315.85 kB; `client/dist/index.html` present |
| 2 | MongoDB connection | server log | **PASS** — `MongoDB connected: 127.0.0.1/rewear` |
| 3 | Backend startup | server log | **PASS** — `ReWear API running on http://localhost:5000` |
| 4 | Health check | `GET /api/health` | **PASS** — `{"success":true,"message":"ReWear API is running"}` |
| 5 | Database seed | `npm run seed` | **PASS** — 4 users, 12 items, 2 requests; idempotent |

### 7.2 Authentication

| # | Test | Result |
|---|---|---|
| 6 | `POST /api/auth/register` (new user) | **PASS** — 201, JWT returned |
| 7 | `POST /api/auth/register` (duplicate email) | **PASS** — 400 |
| 8 | `POST /api/auth/login` (correct) | **PASS** — 200, token + user |
| 9 | `POST /api/auth/login` (wrong password) | **PASS** — 401 |
| 10 | `GET /api/auth/me` with valid JWT | **PASS** — 200, correct email |
| 11 | Protected route without token | **PASS** — 401 |
| 12 | Protected route with invalid JWT | **PASS** — 401 |
| 13 | Login as deactivated account | **PASS** — 403 |
| 14 | Password never present in responses | **PASS** — profile/login payloads contain no `password` |

### 7.3 Item CRUD, ownership & filters

| # | Test | Result |
|---|---|---|
| 15 | `GET /api/items` (public browse) | **PASS** — 200, list returned (22 items post-seed) |
| 16 | `POST /api/items` (JSON, no image) | **PASS** — 201, status `Available` |
| 17 | `POST /api/items` (multipart with PNG) | **PASS** — 201, image saved to `/uploads/…png`, file exists on disk |
| 18 | `GET /api/items/:id` | **PASS** — 200, owner populated (name) |
| 19 | `PUT /api/items/:id` (owner edit) | **PASS** — 200, title updated |
| 20 | `PUT /api/items/:id` as another user | **PASS** — 403 |
| 21 | `DELETE /api/items/:id` (owner) | **PASS** — 200 |
| 22 | `GET /api/items/:id` after delete | **PASS** — 404 |
| 23 | Search filter (`search=Solo Batch Item`) | **PASS** — 200, 1 match |
| 24 | Keyword filter | **PASS** |
| 25 | Category + size + condition filter | **PASS** |
| 26 | Type + location filter | **PASS** |
| 27 | Negative filter (impossible combo) → 0 results | **PASS** |

### 7.4 Request lifecycle (donation & exchange)

| # | Test | Result |
|---|---|---|
| 28 | Create donation request | **PASS** — 201 `Pending`, item → `Requested` |
| 29 | Create exchange request with `offeredItemId` | **PASS** — 201 `Pending`, `offeredItem` set |
| 30 | Exchange request **without** `offeredItemId` | **PASS** — 400 “Select one of your items to offer in exchange” |
| 31 | Request own item | **PASS** — 400 |
| 32 | Duplicate open request for same item | **PASS** — 400 |
| 33 | Non-owner tries to accept | **PASS** — 403 |
| 34 | Owner accepts | **PASS** — 200, `Accepted` |
| 35 | Requester tries to accept own request | **PASS** — 403 |
| 36 | Owner rejects | **PASS** — 200, `Rejected`, item back to `Available` |
| 37 | Requester cancels own request | **PASS** — 200, `Cancelled`, item back to `Available` |
| 38 | Owner completes accepted donation | **PASS** — 200, `Completed`, item → `Donated` |
| 39 | Complete an exchange (either party) | **PASS** — 200, `Completed`, main + offered items both → `Exchanged` |
| 40 | Complete an already-completed request | **PASS** — 400 |
| 41 | Accept an already-completed request | **PASS** — 400 |
| 42 | Cancel a completed request | **PASS** — 400 |

### 7.5 User dashboard & profile

| # | Test | Result |
|---|---|---|
| 43 | `GET /api/users/profile` | **PASS** — 200, name/role/isActive |
| 44 | `PUT /api/users/profile` | **PASS** — 200, name updated, no password in response |
| 45 | `GET /api/users/impact` (dashboard) | **PASS** — `myListings=4, completedExchanges=1, completedDonations=1, impactScore=2` |
| 46 | `GET /api/impact` (public metrics) | **PASS** — users/items/score counters returned |

### 7.6 Admin area

| # | Test | Result |
|---|---|---|
| 47 | Admin login | **PASS** — 200, `role=admin` |
| 48 | `GET /api/admin/stats` | **PASS** — users=9, items=27, requests=8, pending=3, score=2 |
| 49 | `GET /api/admin/users` | **PASS** — 9 users with roles + listing counts |
| 50 | `GET /api/admin/items` | **PASS** — all 27 items (incl. Removed) |
| 51 | `GET /api/admin/requests` | **PASS** — 8 requests |
| 52 | Non-admin calls admin endpoint | **PASS** — 403 |
| 53 | Deactivate a user | **PASS** — 200, `isActive=false`; that user's login then → 403 |
| 54 | Re-activate the user | **PASS** — 200, `isActive=true` |
| 55 | Soft-remove an item (`DELETE /api/admin/items/:id`) | **PASS** — 200, status → `Removed` |
| 56 | Removed item hidden from public browse | **PASS** — not in `GET /api/items` |
| 57 | Removed item detail returns 404 | **PASS** — 404 |
| 58 | Removed item still visible to admin with status `Removed` | **PASS** |
| 59 | Soft-remove same item again | **PASS** — 400 “already removed” |

### 7.7 File upload validation

| # | Test | Result |
|---|---|---|
| 60 | Valid PNG upload (multipart) | **PASS** — 201, file written to `server/uploads/` |
| 61 | Oversized file (> 2 MB) | **PASS** — 400 “Image must be smaller than 2 MB” |
| 62 | Non-image `.txt` upload | **PASS after fix** — 400 “Only JPG, PNG and WEBP image files are allowed” (initially returned 500 — see §9) |

**Summary: 62 executed checks, all passing after the two fixes in §9.**
Automated batches covering these checks were run in small groups with 10-second HTTP
timeouts; no test was left hanging.

## 8. Implementation-Verified (source inspection only, not browser-executed)

These core features are implemented and reviewed in source code, and the frontend
compiles cleanly in the production build, but were **not** driven through a real browser
in this session — no UI automation was performed:

- 22 React routes with `ProtectedRoute` / `AdminRoute` guards (`client/src/App.jsx`)
- Auth context, JWT interceptor and 401 auto-logout (`services/api.js`, `context/AuthContext.jsx`)
- Browse page filter → URL params → API query (`pages/Browse.jsx`, `components/FilterBar.jsx`)
- Request actions wired to the request API with per-row perspective based on the current user
  (`components/RequestTable.jsx`, `components/RequestModal.jsx`)
- Admin pages calling the admin endpoints listed in §5 (`pages/admin/*`)
- Item form with image field → `FormData` multipart upload (`components/ItemForm.jsx`)
- Impact page rendering `/api/impact` counters (`pages/Impact.jsx`)

## 9. Bugs Found and Fixed During Testing

1. **Request ownership checks always failed (403).**
   `loadRequest()` populates `owner`/`requester` into full objects, but the accept/reject/
   cancel/complete handlers compared `String(request.owner)` — which yields
   `[object Object]`. Fixed in `server/controllers/requestController.js` with
   `ownerIdOf()` / `requesterIdOf()` helpers that read `._id` when populated.
   *Found by:* owner accept test returning 403; *verified fixed by:* accept → `Accepted`,
   reject/cancel/complete and all actor guards passing (tests 34–42).

2. **Invalid file type returned 500 instead of 400.**
   The multer `fileFilter` rejected with a plain `Error`, which the central error handler
   treated as internal. Fixed in `server/middleware/upload.middleware.js` by tagging the
   error with `statusCode = 400`. *Verified fixed by:* test 62.

3. *(Earlier, during frontend build)* `emptyFilters` was exported from a component file
   that broke the production build → moved to `components/FilterBar.jsx`; `RequestTable`
   now derives each row's perspective from `currentUserId`. Build then passed (test 1).

## 10. Reflection

- Enforcing the request lifecycle on the server (rather than trusting the UI) proved
  essential — every state transition was exercised and guards behaved consistently.
- Populated Mongoose documents are a subtle source of identity-comparison bugs; the
  helpers introduced in fix #1 centralise that concern.
- Multer error typing needs explicit mapping to HTTP status codes to keep API responses
  consistent for the frontend.
- Running tests in small batches with explicit timeouts made failures easy to localise
  (test harness issue vs. backend defect) without re-running the whole suite.

## 11. Future Work

- Email notifications for request status changes.
- Pagination for large browse/admin lists.
- Image resizing/optimisation on upload.
- Unit + integration tests with a test runner (Jest/Vitest) to automate the log in §7.
- Deploy behind HTTPS with a production `JWT_SECRET` and restricted `CLIENT_URL`.

## 12. How to Run

```bash
npm run install:all
npm run seed
npm run dev          # client http://localhost:5173 · API http://localhost:5000/api
```

Test accounts: `admin@rewear.test / Admin@123`,
`aarav@rewear.test`, `diya@rewear.test`, `rohan@rewear.test` / `Password@123`.
