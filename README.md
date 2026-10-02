# FixMyCampus

A complaint and maintenance tracker for campus life. Students report broken fans, leaking taps, dead street lights and dirty washrooms. Peers upvote the issues that matter most, and staff assign, track and resolve them in the open, so nobody wonders whether a complaint was lost.

## Live links

| What | Link |
|---|---|
| Web app (frontend) | `<FRONTEND_LINK>` |
| API (backend) | https://fixmycampus-api.onrender.com |
| API health check | https://fixmycampus-api.onrender.com/health |
| Source code | https://github.com/urmee111/FixMyCampus |

> The API runs on a free Render instance. After a period of inactivity the first request can take up to about a minute while the server wakes up.

## Test logins

| Role | Email | Password |
|---|---|---|
| Student | `student@fixmycampus.test` | `Student@123` |
| Student 2 | `student2@fixmycampus.test` | `Student@123` |
| Staff / Admin | `admin@fixmycampus.test` | `Admin@123` |

## Roles

| | Student | Staff / Admin |
|---|---|---|
| Report issues, edit (own, while Open) and delete (own) | Yes | No (staff review and resolve) |
| Upvote an issue (one per user) | Yes | No |
| Comment | Yes | Yes (shown with an "Official" badge) |
| Change status (Open, In Progress, Resolved) | No (403) | Yes |
| Delete any issue (moderation) | No | Yes |
| My Reports | Yes | No |
| Dashboard with statistics | No | Yes |

## Features

**Core (MVP)**
- Signup and login with role-based access (Student or Staff / Admin). Admin signup needs a secret admin code.
- Report an issue: title, description, category (Electrical, Water, Cleanliness, Furniture, Internet, Other), location and an optional photo.
- Browse all issues with search and filters (category, status, location), sorting and pagination.
- Upvote an issue so the most urgent ones rise to the top. One upvote per user, enforced by the database.
- Comment on an issue to add updates.
- Admin updates the status with an optional note. The note appears as an official comment.
- Student dashboard ("My Reports") and admin dashboard with statistics.

**Bonus**
- Duplicate warning: while typing a title, similar open issues in the same category and location are suggested (PostgreSQL `pg_trgm`). It only warns; the student can still report.
- Priority label computed from the upvote count (High, Medium, Low).
- Sorting (most upvoted, newest, oldest) and pagination on the listing endpoint.
- Average resolution time and other numbers on the admin dashboard.
- Status timeline on every issue (who changed what, when, and why).
- Dark mode and a mobile-friendly layout.

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Validation and security | zod, bcryptjs, JSON Web Tokens, helmet, CORS, express-rate-limit |
| Database | PostgreSQL on Supabase (plain SQL, no ORM) |
| Photo storage | Supabase Storage |
| API testing | Thunder Client / Postman |
| Hosting | Vercel or Netlify (frontend), Render (backend), Supabase (database and storage) |

## Architecture

```
User -> Frontend (React) -> Backend API (Express: login check, role check, validation) -> PostgreSQL
                                                                                       (users, issues, comments, upvotes, status_history)
```

**Database tables**

| Table | Main fields |
|---|---|
| `users` | id, name, email (unique), password_hash, role (`student` / `admin`) |
| `issues` | id, title, description, category, location, photo_url, status, created_by, created_at, updated_at, resolved_at |
| `comments` | id, issue_id, user_id, text, created_at |
| `upvotes` | issue_id, user_id (composite primary key = one upvote per user) |
| `status_history` | id, issue_id, old_status, new_status, changed_by, note, changed_at |

Upvote and comment counts are computed with `COUNT`, never stored, so they cannot go out of sync. Check constraints and foreign keys with `ON DELETE CASCADE` keep the data clean.

## API endpoints

All responses use one shape: `{ "success": true, "data": ... }` or `{ "success": false, "error": { "code", "message", "fields" } }`.

| # | Endpoint | Who can call it | Success | Main errors |
|---|---|---|---|---|
| 1 | `POST /auth/signup` | Public | 201 + token | 400 validation, 403 wrong admin code, 409 email exists |
| 2 | `POST /auth/login` | Public | 200 + token | 400, 401 invalid email or password, 429 too many attempts |
| 3 | `POST /issues` | Logged in | 201 | 400 validation (for example empty title), 401 |
| 4 | `GET /issues` | Logged in | 200 (search, filters, sort, pagination) | 400 invalid filter, 401 |
| 5 | `GET /issues/:id` | Logged in | 200 (with comments and status history) | 400 bad id, 404 |
| 6 | `PUT /issues/:id` | Owner only, while Open | 200 | 400, 403 not owner, 404, 409 not editable |
| 7 | `DELETE /issues/:id` | Owner or admin | 200 | 403, 404 |
| 8 | `POST /issues/:id/upvote` | Students | 200 (toggles on and off) | 400 own or resolved issue, 403 admin, 404 |
| 9 | `POST /issues/:id/comments` | Logged in | 201 | 400 empty or too long, 404 |
| 10 | `PATCH /issues/:id/status` | **Admin only** | 200 | **403 student**, 400 invalid, same or not allowed status change, 404 |
| 11 | `GET /my/issues` | Logged in | 200 (items and counts by status) | 401 |
| 12 | `GET /stats` | **Admin only** | 200 | 403 student |
| 13 | `GET /issues/similar` | Logged in | 200 (up to 3 possible duplicates) | 400 |

Allowed status changes: Open to In Progress, Open to Resolved, In Progress to Resolved, and Resolved back to Open.

Screenshots of every endpoint working are in `docs/screenshots/`.

## Role restriction and validation (required demonstrations)

- **Role restriction:** a student calling `PATCH /issues/:id/status` gets `403 "Only admins can change status"`.
- **Validation error:** `POST /issues` with an empty title returns `400 "Title is required"` with the field name.

## Run it locally

Requirements: Node.js 18 or newer and a PostgreSQL database (Supabase works).

**Backend**

```bash
cd backend
npm install
cp .env.example .env     # then fill in the values
npm run dev              # http://localhost:5000
```

Run `backend/sql/schema.sql` once in your database. Environment variables (names only): `PORT`, `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `ADMIN_SIGNUP_CODE`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SUPABASE_BUCKET`, `FRONTEND_URL`.

**Frontend**

```bash
cd frontend
npm install
cp .env.example .env     # set VITE_API_BASE_URL to the backend address
npm run dev              # http://localhost:5173
```

## Team

| Name | Part |
|---|---|
| Noushin Anamika Urmee | Backend API (13 endpoints), database design, authentication and security, deployment on Render and Supabase, documentation |
| Arina Afrin | Frontend: React pages, UI and UX design, dark mode and mobile layout, demo video |
| Tanjim Hasan | Frontend deployment, testing and QA |