# FixMyCampus

Campus issue tracker built for a 10-hour hackathon by a team of 3 beginners: students report issues,
upvote them and track their status; admins change status and see stats. Full plan (scope, API contract,
edge-case checklist): [docs/FixMyCampus_Hackathon_Plan.md](docs/FixMyCampus_Hackathon_Plan.md).
Keep the code **simple and readable**: beginners must be able to explain every file.

## Stack
- Backend: Node.js + Express 5, PostgreSQL via `pg` (plain SQL, no ORM), zod, JWT, bcryptjs. Plain JavaScript, ES modules.
- Frontend: React + Vite, Tailwind CSS v4 (class-based dark mode), react-router-dom, axios. Plain JavaScript, ES modules.
- DB + photo storage: Supabase. Hosting: Render (backend), Vercel (frontend).

## Folder structure
```
backend/
  sql/schema.sql            database schema (plan Section 5)
  scripts/seed.js           demo data (TODO)
  src/
    index.js                starts the server        app.js  Express setup
    config/                 env.js, db.js (pg Pool), supabase.js (photo storage)
    middleware/             auth, role, validate, errorHandler, notFound, rateLimit, upload
    routes/                 one file per URL prefix; wire middleware + controller
    controllers/            handle request/response (all 13 endpoints are implemented)
    models/                 ALL SQL lives here
    validators/             zod schemas
    utils/                  AppError, asyncHandler, response (ok/fail), constants, photoStorage (Supabase upload/delete)
frontend/
  src/
    App.jsx                 ROUTES ONLY            main.jsx  providers
    api/                    axios client + one function per endpoint
    context/                AuthContext, ThemeContext   hooks/  useAuth, useDebounce
    routes/                 ProtectedRoute
    components/             layout/ ui/ issues/ comments/ admin/
    pages/                  one file per route     utils/  constants, formatters, priority
    mocks/mockData.js       fake API data in the real response shapes
docs/                       plan, Postman collection
```

## Coding rules
- **Response shape** everywhere (plan Section 6.1): `ok(res, data, status)` -> `{ success: true, data }`;
  errors -> `{ success: false, error: { code, message, fields? } }`. Throw `AppError` (or call `fail`); never hand-write the JSON.
  Error codes: VALIDATION_ERROR 400, UNAUTHORIZED 401, FORBIDDEN 403, NOT_FOUND 404, CONFLICT 409, RATE_LIMITED 429, SERVER_ERROR 500.
- **SQL**: only in `models/`, always parameterized (`$1, $2` with `query(text, params)`), never string concatenation.
- **Validation**: every route with input uses `validate(zodSchema, 'body'|'query'|'params')`. Controllers read the clean
  data from `req.validated.body / .query / .params`, not from `req.body`.
- **Roles**: checked in middleware (`requireAuth`, then `requireRole('admin'|'student')`), never only in the UI.
  Ownership checks ("owner only") need the DB row, so they live in the controller.
- Route order: `GET /issues/similar` must stay registered BEFORE `GET /issues/:id`.
- Never return `password_hash`. Never commit `.env` (only `.env.example`). Use `bcryptjs`, not `bcrypt`.
- Frontend: all API calls go through `src/api/*` (they return `response.data.data`). Every page needs loading, empty and
  error states, and every button that calls the API must be disabled while loading. Never use `dangerouslySetInnerHTML`.

## Run
```bash
cd backend  && npm install && cp .env.example .env && npm run dev   # http://localhost:5000/health
cd frontend && npm install && cp .env.example .env && npm run dev   # http://localhost:5173
cd frontend && npm run build                                        # production build check
```

## Ownership (avoid Git conflicts)
- `backend/` = **Member A**
- `frontend/` except admin files = **Member B** (only Member B edits `App.jsx` routes)
- `frontend/src/components/admin/`, `frontend/src/pages/AdminDashboardPage.jsx`, `backend/sql/`, `docs/` = **Member C**

Work on your own branch, pull `main` before merging, and keep `main` working.
