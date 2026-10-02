# FixMyCampus

A campus issue tracker: students **report** broken things (fans, water, WiFi...), **upvote** problems that
affect many people, and **track** them until they are **resolved**. Admins get a dashboard with stats,
charts and QR codes for locations. Built in 10 hours for a hackathon.

> Full game plan: [docs/FixMyCampus_Hackathon_Plan.md](docs/FixMyCampus_Hackathon_Plan.md)

## Features

TODO: fill in at the end (see plan Section 15). Planned: report issues with photo, upvotes, comments,
duplicate warning, priority labels, status timeline, admin dashboard, QR code reporting, dark mode.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite, Tailwind CSS v4 (class-based dark mode), react-router-dom, axios, react-hot-toast, recharts, qrcode.react, lucide-react |
| Backend | Node.js + Express 5, plain SQL with `pg`, zod validation, JWT auth, bcryptjs, multer, helmet, cors, express-rate-limit |
| Database | PostgreSQL on Supabase (+ Supabase Storage for photos) |
| Hosting | Vercel (frontend), Render (backend) |

## Setup

You need Node.js 20+ and a Supabase project (free).

### 1. Database
1. Create a Supabase project.
2. Open the SQL editor and run [backend/sql/schema.sql](backend/sql/schema.sql).
3. Create a **public** storage bucket named `issue-photos`.

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env     # then fill in the values (see "Environment variables")
npm run dev              # http://localhost:5000  ->  check http://localhost:5000/health
```
Other scripts: `npm start` (production), `npm run seed` (demo data, not built yet).

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:5000
npm run dev              # http://localhost:5173
```
Production build: `npm run build`.

## Environment variables

**backend/.env** (never commit this file)

| Name | What it is |
|---|---|
| `PORT` | Port of the API (default 5000) |
| `DATABASE_URL` | Supabase Postgres connection string |
| `JWT_SECRET` | Long random text used to sign login tokens |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `ADMIN_SIGNUP_CODE` | Secret code people must enter to sign up as admin |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase service key (secret, backend only) |
| `SUPABASE_BUCKET` | Storage bucket for photos (`issue-photos`) |
| `FRONTEND_URL` | Frontend address allowed by CORS |
| `ENABLE_ASSISTANT` | `false` (optional AI assistant stretch goal) |

**frontend/.env**

| Name | What it is |
|---|---|
| `VITE_API_URL` | Address of the backend API |

## Test logins

Created by the seed script (plan Section 14).

| Role | Email | Password |
|---|---|---|
| Student | `student@fixmycampus.test` | `Student@123` |
| Student 2 | `student2@fixmycampus.test` | `Student@123` |
| Admin | `admin@fixmycampus.test` | `Admin@123` |

## API endpoints

All responses use `{ "success": true, "data": ... }` or `{ "success": false, "error": { "code", "message", "fields"? } }`.
Protected endpoints need the header `Authorization: Bearer <token>`. Plus `GET /health` (public).

| # | Method & path | Who | Success | Main errors |
|---|---|---|---|---|
| 1 | `POST /auth/signup` | Public | 201 + token + user | 400 invalid fields, 409 email exists, 403 wrong admin code |
| 2 | `POST /auth/login` | Public | 200 + token + user | 400 missing fields, 401 invalid credentials, 429 too many tries |
| 3 | `POST /issues` | Logged in | 201 + issue | 400 validation, 401 |
| 4 | `GET /issues` | Logged in | 200 + paginated list | 400 bad filter value |
| 5 | `GET /issues/:id` | Logged in | 200 + issue + comments + history | 400 bad id, 404 |
| 6 | `PUT /issues/:id` | Owner only | 200 + issue | 403 not owner, 409 not editable (not Open), 400, 404 |
| 7 | `DELETE /issues/:id` | Owner or admin | 200 | 403, 404 |
| 8 | `POST /issues/:id/upvote` | Student | 200 + `{ upvoted, upvoteCount }` | 400 own issue / resolved, 403 admin, 404 |
| 9 | `POST /issues/:id/comments` | Logged in | 201 + comment | 400 empty/too long, 404 |
| 10 | `PATCH /issues/:id/status` | **Admin only** | 200 + issue | 403 student, 400 invalid/same status, 404 |
| 11 | `GET /my/issues` | Logged in | 200 + list | 401 |
| 12 | `GET /stats` | **Admin only** | 200 + stats | 403 student |
| 13 | `GET /issues/similar?title=&category=&building=` | Logged in | 200 + up to 3 possible duplicates | 400 title too short / invalid category |

## Live links

TODO: frontend (Vercel) · backend (Render) · demo video

## Screenshots

TODO

## Team

| Member | Role | Owns |
|---|---|---|
| TODO name | A: Backend lead | `backend/` |
| TODO name | B: Frontend lead | `frontend/` (except admin files) |
| TODO name | C: Data, DevOps and QA lead | `backend/sql/`, `docs/`, admin dashboard files |
