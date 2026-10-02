# FixMyCampus Frontend

React and Vite frontend for campus issue reporting, community prioritization, and maintenance tracking.

## Run locally

```powershell
npm ci
Copy-Item .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` to the backend origin. `VITE_USE_MOCK=true` enables the in-memory demo adapter; set it to `false` when the API is ready. Frontend environment variables are public configuration, not secret storage.

Mock sign-in accepts any password of at least six characters. Use `tanjim@campus.edu` for the student view or `admin.estate@campus.edu` for the admin view; the password is `password123`.

## Routes

- `/` landing page
- `/login`, `/signup` authentication
- `/issues` searchable and filterable issue registry
- `/issues/:id` details, comments, upvotes, and status history
- `/issues/:id/edit` report editing
- `/report` issue submission with optional photo
- `/my-reports` student report tracking
- `/admin` operations dashboard
- `/admin/locations` reporting location directory

## API surface

All HTTP requests are centralized under `src/api/`. The adapter supports auth signup/login, issues list/detail/create/update/delete, upvotes, comments, status updates, student reports, duplicate checks, and statistics. Mock data and actions are isolated in `src/data/` and the API modules.

## Checks

```powershell
npm run lint
npm run build
```