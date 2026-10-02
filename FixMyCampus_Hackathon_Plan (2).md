# FixMyCampus: 10-Hour Hackathon Game Plan

**Team:** 3 members · **Time:** 4:00 PM → 2:00 AM · **Target:** 100 + 10 (deploy) + 5 (extras)

---

## 0. The Strategy in 60 Seconds

1. **Build a boring, stable core first.** 35 of 100 points are "working API features". A clean CRUD app that works on every click beats a fancy app that crashes during the demo.
2. **Deploy early (by ~10:00 PM), not at 1:30 AM.** Deployment is +10 bonus, and late deployments are where first-time teams lose those points.
3. **Bonuses only after the MVP works end to end.**
4. **RAG chatbot = stretch goal only** (see Section 9). The rules literally say no AI is required and to focus on a stable frontend and backend.
5. **Feature freeze at 12:30 AM.** After that, only bug fixes, README, slides and the demo video.

---

## 1. Where the Points Are (and How We Get Each One)

| Criteria | Pts | What we do to max it |
|---|---|---|
| Working API features (10+ endpoints) | 35 | All 12 required endpoints + 1 bonus (`/issues/similar`). Every one shown in a Postman collection. |
| Real-world usefulness & creativity | 15 | Duplicate warning, priority labels, status timeline, official admin replies, QR-code location reporting. |
| Frontend UI/UX | 15 | Clean layout, loading/empty/error states, toasts, mobile-first, dark mode. |
| Role-based access & validation | 10 | Student vs admin checks on 5+ endpoints; clear validation messages on every input. |
| Database design | 15 | Normalized tables, foreign keys, CHECK constraints, unique upvote key, indexes, cascade deletes. |
| Presentation & teamwork | 10 | 5 slides, rehearsed 2.5-min demo, all three members speak. |
| **Bonus:** live deployment | +10 | Vercel (frontend) + Render (backend) + Supabase (DB + photo storage). |
| **Bonus:** extras & accessibility | +5 | Dark mode, keyboard navigation, labels, alt text, contrast. |

---

## 2. Tech Stack Decision

**Rule #1: Use what at least one of you already knows. Do not learn a new framework tonight.**

Default recommendation (if you know basic JavaScript):

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + Vite + Tailwind CSS | Fast setup, easy dark mode and responsive layout |
| Backend | Node.js + Express | Exactly matches the endpoint list; easy to explain |
| Validation | `zod` (or `express-validator`) | Clear, consistent error messages |
| Auth | `bcrypt` + `jsonwebtoken` (JWT) | Standard and simple |
| Database | PostgreSQL on **Supabase** (free) | Same DB locally and in production, so no migration panic |
| Photo storage | Supabase Storage (public bucket) | Same account as the DB |
| DB client | `pg` with plain SQL | Easy to explain to judges ("we wrote this query") |
| API testing | Postman | Required deliverable |
| Hosting | Vercel (frontend), Render (backend) | Free tiers |

If one of you knows Python Flask better, use Flask + the same Supabase Postgres. Everything else in this plan still applies.

**Avoid SQLite on Render:** the free tier's filesystem resets, so your data disappears after a restart.

---

## 3. Who Does What (3 members)

| Member A: Backend Lead | Member B: Frontend Lead | Member C: Data, DevOps & QA Lead |
|---|---|---|
| Express setup, auth + role middleware | React app, routing, layout, auth context | GitHub repo, Supabase project, schema + seed data |
| All 13 API endpoints + validation | Login/Signup, Issue list, Report form, Issue detail, My Reports, Edit page | Photo storage bucket, `.env.example`, Postman collection (tests each endpoint as soon as A finishes it) |
| Duplicate check query, rate limiting, priority + avg resolution | Dark mode, mobile layout, toasts, loading/empty/error states | Admin dashboard page (stats cards, charts, QR generator) |
| Fixes bugs from C's test reports | Accessibility pass | Deploy backend (Render) + frontend (Vercel), runs the full edge-case checklist |
| README API section, Postman export | Slides design + screenshots | Demo video, README setup section; RAG stretch goal (only if green at 11:30) |

**Everyone together:** API contract (first 30 min), integration checkpoints, demo rehearsal.

**Key trick:** agree on the API contract in Section 6 *first*. Then B and C build their pages using fake data with the same shape while A builds the real API. Nobody waits for anybody.

**Avoid Git conflicts with folder ownership:**
- A owns `backend/src/`
- B owns `frontend/src/` (except the admin folder) and is the **only one who edits `App.jsx` routes**
- C owns `backend/sql/`, `docs/`, and `frontend/src/pages/admin/`
- Each person works on their own branch (`backend`, `frontend`, `admin-devops`) and merges into `main` only when the feature works. Pull `main` before every merge.

---

## 4. Timeline (3 members)

| Time | A (Backend) | B (Frontend) | C (Data / DevOps / QA) | Checkpoint |
|---|---|---|---|---|
| 4:00–4:30 | **All three:** read Sections 0, 3, 4, 6, 7; lock API contract; then Express skeleton + error handler | Vite + Tailwind + router skeleton | Create repo, Supabase project, run schema, share secrets in private chat (never in Git), make Render/Vercel accounts | ✅ Everyone runs the project locally |
| 4:30–6:00 | `db.js`, `/auth/signup`, `/auth/login`, auth + role middleware | Navbar, Login/Signup pages, AuthContext, `api/client.js` | Seed SQL (3 users, ~20 issues, upvotes, comments), Postman environment + Auth folder | |
| 6:00–7:30 | `POST/GET/PUT/DELETE /issues`, search, filters, pagination, photo upload | Issue list (cards, filters, search), Report form (mock data) | Postman tests for each endpoint as it lands, report bugs to A; Admin dashboard UI with mock stats | |
| 7:30–8:00 | **Dinner + connect frontend to real auth and issues** | | | ✅ Real login + real issue list |
| 8:00–9:30 | Upvote, comments, status PATCH + history, `/my/issues`, `/stats`, `/issues/similar` | Issue detail, upvote, comments, My Reports, admin status controls, edit page | Connect admin dashboard to real `/stats`; test new endpoints; prepare `vercel.json` + Render settings | |
| 9:30–10:15 | Fix backend deploy issues | Fix frontend deploy issues | **Leads the deploy**: Render + Vercel + CORS, tests live link | ✅ **MVP live on public link** |
| 10:15–11:30 | Rate limit, priority, avg resolution time, fixes from C's edge-case list | Duplicate warning UI, dark mode, mobile polish, toasts, loading states | QR generator, charts polish, runs full edge-case checklist (Section 7) | |
| 11:30 | **Decision point:** everything green? Then C (with A's help on the endpoint) tries RAG-lite, 90 min timebox. Otherwise all three polish. | | | |
| 11:30–12:30 | Bug fixes / RAG endpoint support | Accessibility pass, UI polish, screenshots | RAG-lite (if green) OR more testing + better seed data | 🔒 **Feature freeze 12:30** |
| 12:30–1:30 | README (API table + setup), Postman export + screenshots | 5 slides | Record + trim demo video (by 1:15) | |
| 1:30–1:45 | **All three:** final redeploy, test both logins on live link | | | |
| **1:45** | **SUBMIT** (15 min early, never at 1:59) | | | ✅ Done |

---

## 5. Database Design (PostgreSQL)

Run this in the Supabase SQL editor.

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;  -- for duplicate/similar-title search

CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(80)  NOT NULL,
  email         VARCHAR(120) NOT NULL UNIQUE,          -- store lowercased
  password_hash TEXT         NOT NULL,
  role          VARCHAR(10)  NOT NULL DEFAULT 'student'
                CHECK (role IN ('student', 'admin')),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE issues (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(120) NOT NULL CHECK (length(trim(title)) >= 5),
  description TEXT         NOT NULL CHECK (length(trim(description)) >= 10),
  category    VARCHAR(20)  NOT NULL CHECK (category IN
              ('Electrical','Water','Cleanliness','Furniture','Internet','Other')),
  location    VARCHAR(120) NOT NULL,
  photo_url   TEXT,
  status      VARCHAR(15)  NOT NULL DEFAULT 'Open'
              CHECK (status IN ('Open','In Progress','Resolved')),
  created_by  INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ                                -- for avg resolution time
);

CREATE TABLE comments (
  id         SERIAL PRIMARY KEY,
  issue_id   INT  NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  user_id    INT  NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  text       VARCHAR(500) NOT NULL CHECK (length(trim(text)) >= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE upvotes (
  issue_id   INT NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  user_id    INT NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (issue_id, user_id)        -- DB-level guarantee: one upvote per user
);

-- Bonus table: status timeline on the issue page
CREATE TABLE status_history (
  id         SERIAL PRIMARY KEY,
  issue_id   INT NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  old_status VARCHAR(15),
  new_status VARCHAR(15) NOT NULL,
  changed_by INT NOT NULL REFERENCES users(id),
  note       VARCHAR(300),
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_issues_status     ON issues(status);
CREATE INDEX idx_issues_category   ON issues(category);
CREATE INDEX idx_issues_created_by ON issues(created_by);
CREATE INDEX idx_issues_title_trgm ON issues USING gin (title gin_trgm_ops);
CREATE INDEX idx_comments_issue    ON comments(issue_id);
```

**Talking points for judges (Database Design = 15 pts):**
- The composite primary key on `upvotes` makes "one upvote per user" impossible to break, even with double-clicks or race conditions.
- `CHECK` constraints mean bad data is rejected even if the API has a bug.
- `ON DELETE CASCADE` means deleting an issue cleans up its comments, upvotes and history.
- `resolved_at` and `status_history` power the analytics without extra work.
- Upvote count is computed with `COUNT`, not stored, so it can never get out of sync.

---

## 6. API Contract

### 6.1 Standard response shape (use everywhere)

```json
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "Title is required", "fields": { "title": "Title is required" } } }
```

Error codes: `VALIDATION_ERROR` (400), `UNAUTHORIZED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `CONFLICT` (409), `RATE_LIMITED` (429), `SERVER_ERROR` (500).

### 6.2 Endpoint table

| # | Method & Path | Who | Success | Main errors |
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
| 10 | `PATCH /issues/:id/status` | **Admin only** | 200 + issue | **403 student**, 400 invalid/same status, 404 |
| 11 | `GET /my/issues` | Logged in | 200 + list | 401 |
| 12 | `GET /stats` | **Admin only** | 200 + stats | 403 student |
| 13 ⭐ | `GET /issues/similar?title=...&category=...&building=...` | Logged in | 200 + up to 3 possibly-duplicate open issues | 400 title too short / invalid category |

⚠️ **Express route order:** define `/issues/similar` **before** `/issues/:id`, or Express will treat "similar" as an id.

### 6.3 Details for the tricky endpoints

**`POST /auth/signup`**
```json
{ "name": "Rahim", "email": "rahim@uni.edu", "password": "secret123", "role": "student" }
```
If `role` is `"admin"`, an `adminCode` field must match the `ADMIN_SIGNUP_CODE` env variable. Otherwise return 403. (Without this, any student can sign up as admin. Judges love it when you show you thought of this.)

**`GET /issues` query parameters**

| Param | Example | Rule |
|---|---|---|
| `q` | `fan` | Searches title, description, location (`ILIKE`, parameterized) |
| `category` | `Electrical` | Must be a valid category, else 400 |
| `status` | `Open` | Must be a valid status, else 400 |
| `location` | `Hall 2` | Partial match |
| `sort` | `upvotes` / `newest` / `oldest` | Default `upvotes`, ties broken by newest |
| `page` | `1` | Integer ≥ 1 |
| `limit` | `10` | 1–50, capped at 50 |

Response:
```json
{ "success": true, "data": { "items": [ { "id": 7, "title": "...", "upvoteCount": 12, "commentCount": 3, "priority": "High", "hasUpvoted": true, "...": "..." } ], "page": 1, "limit": 10, "total": 42, "totalPages": 5 } }
```
Empty results return `200` with `items: []`, not 404.

**`POST /issues/:id/upvote`** is a toggle: if a row exists, delete it (`upvoted: false`); else insert (`upvoted: true`). Return the fresh count.

**`PATCH /issues/:id/status`**
```json
{ "status": "In Progress", "note": "Electrician assigned for tomorrow" }
```
Allowed transitions: Open → In Progress, Open → Resolved, In Progress → Resolved, Resolved → Open (reopen). Same status → 400. Set `resolved_at = now()` when Resolved, set it back to `NULL` on reopen. Insert a `status_history` row every time.

**`GET /stats`**
```json
{
  "total": 42,
  "byStatus":   { "Open": 20, "In Progress": 12, "Resolved": 10 },
  "byCategory": { "Electrical": 11, "Water": 9, "Cleanliness": 8, "Furniture": 5, "Internet": 6, "Other": 3 },
  "topUpvoted": [ { "id": 7, "title": "...", "upvoteCount": 25 } ],
  "avgResolutionHours": 18.4,
  "resolvedLast7Days": 6,
  "topLocations": [ { "location": "Hall 2", "count": 9 } ]
}
```

---

## 7. Edge Case Checklist

Tick each one off during testing (11:30 PM–12:30 AM). Several of these make great live-demo moments.

### Auth
- [ ] Empty name/email/password → 400 with a field-specific message
- [ ] Invalid email format → 400
- [ ] Password shorter than 6 characters → 400
- [ ] Email already exists → 409 "An account with this email already exists"
- [ ] `Rahim@Uni.edu` and `rahim@uni.edu` treated as the same email (trim + lowercase)
- [ ] Role not `student`/`admin` → 400
- [ ] Admin signup without correct code → 403
- [ ] Wrong password **or** unknown email → same message "Invalid email or password" (don't reveal which)
- [ ] `password_hash` never appears in any API response
- [ ] Missing/invalid/expired token → 401; frontend logs out and redirects to login
- [ ] Too many login attempts → 429 (`express-rate-limit`, e.g. 10 per 15 min)

### Issues
- [ ] Empty or whitespace-only title → 400 "Title is required" (**mandatory demo**)
- [ ] Title too short (<5) or too long (>120) → 400
- [ ] Invalid category → 400 listing the valid options
- [ ] Non-numeric id (`/issues/abc`) → 400; non-existent id → 404
- [ ] Student edits someone else's issue → 403
- [ ] `status` sent in `PUT` body → ignored or 400 (status only via PATCH)
- [ ] Owner edits an issue that is already In Progress/Resolved → 409 "Only open issues can be edited"
- [ ] Owner deletes own issue → OK; student deletes another's → 403; admin deletes any → OK (moderation)
- [ ] Deleting an issue removes its comments, upvotes and history (cascade)
- [ ] Photo not jpg/png/webp, or bigger than 2 MB → 400
- [ ] All SQL uses parameters (`$1, $2`), never string concatenation (SQL injection)
- [ ] Duplicate check: same title, **different building** → no warning
- [ ] Duplicate check: same title, same building, **different category** → no warning
- [ ] Duplicate check: matching issue is Resolved → no warning (the problem may have come back)
- [ ] Duplicate warning is only a warning: **Report anyway** always works
- [ ] Location is stored as `Building, Spot` (building dropdown + optional room/spot box) so the building match is exact, not guessed

### Upvotes
- [ ] Clicking twice toggles (on → off), never counts twice
- [ ] Rapid double-click can't create two upvotes (composite primary key protects this)
- [ ] Upvoting own issue → 400 "You can't upvote your own issue"
- [ ] Upvoting a Resolved issue → 400
- [ ] Admin trying to upvote → 403

### Comments
- [ ] Empty/whitespace comment → 400; over 500 chars → 400
- [ ] Comment on non-existent issue → 404
- [ ] `<script>alert(1)</script>` in a comment shows as plain text (React escapes by default; never use `dangerouslySetInnerHTML`)
- [ ] Admin comments show an "Official" badge
- [ ] Students can still comment on Resolved issues ("still broken!") as feedback

### Status
- [ ] Student calls PATCH status → 403 "Only admins can change status" (**mandatory demo**)
- [ ] Invalid status value → 400
- [ ] Same status as current → 400
- [ ] Resolved → Open (reopen) works and clears `resolved_at`

### Listing & stats
- [ ] Search with no results → empty state on UI ("No issues found. Try another filter.")
- [ ] `limit=1000` → capped at 50; `page=0` or `page=-1` → 400
- [ ] Combined filters work together (category + status + search)
- [ ] Student calling `/stats` → 403
- [ ] Stats with zero resolved issues → `avgResolutionHours: null`, not a crash

### Frontend
- [ ] Every button that calls the API is disabled while loading (prevents double submit)
- [ ] Every page has loading, empty and error states
- [ ] Refreshing on `/issues/5` on Vercel doesn't 404 (add `vercel.json` rewrite to `index.html`)
- [ ] Student never sees admin controls; admin pages redirect students away (UI check **and** API check, the API check is the real security)
- [ ] Confirm dialog before delete

---

## 8. Bonus Features

### From the problem statement (do all five)

| Bonus | How | Time |
|---|---|---|
| Duplicate warning (smart) | While typing, frontend calls `GET /issues/similar` (debounced 400 ms) with title + category + building. **A match needs ALL of:** same category, same building (exact, case-insensitive), not Resolved, and title `similarity() > 0.2` (`pg_trgm`). So "Fan not working" in Hall 2 is never matched with "Fan not working" in Hall 3. UI shows a **soft warning** (never blocks): "Similar issue already reported here. Upvote it instead?" with links, upvote counts, and a **Report anyway** button. | 60 min |
| Priority label | Computed: 10+ upvotes = High 🔴, 5–9 = Medium 🟠, else Low 🟢. Shown as a badge on cards. | 15 min |
| Sorting + pagination | Already in `GET /issues` (Section 6.3) | Included |
| Avg resolution time | `AVG(resolved_at - created_at)` where status = Resolved, shown in hours on admin dashboard | 15 min |
| Dark mode + mobile | Tailwind `dark:` classes + toggle saved in localStorage; mobile-first layout | 45 min |

### Extra creative ones (for the 15 creativity pts + 5 bonus)

| Feature | Why judges like it | Time |
|---|---|---|
| **Status timeline** on issue page (from `status_history`) | Transparency: students see exactly when and what changed | 30 min |
| **Official admin note** when changing status (auto-posted as a comment) | Solves "students never learn if action was taken" from the problem statement | 20 min |
| **QR code per location** (admin page: generate QR → link to `/report?location=Hall 2, Floor 3`) | Very real-world: stick QR codes on walls, scan to report. Use the `qrcode.react` package. | 30 min |
| **Admin charts** (bar by category, pie by status) with `recharts` | Makes the dashboard look professional in the demo | 40 min |
| **"Hotspot" locations** (top 5 locations by issue count) | Helps admins plan maintenance | 15 min |
| **Accessibility**: labels on all inputs, alt text on photos, visible focus rings, `aria-live` toasts, good contrast | Directly earns the accessibility bonus | 30 min |

---

## 9. RAG Chatbot: Should We Build It?

### Honest verdict: **only as a stretch goal, after 11:30 PM, if everything else is green.**

Why:
- The rules say *"No AI feature is required; teams should focus on a stable frontend and backend."* That's a direct hint from the organizers.
- There are **zero dedicated points** for AI. At most it helps the "creativity" score and the +5 extras, which the features in Section 8 already target.
- A chatbot that hallucinates or errors during the demo costs more than it earns.
- Judges will ask "explain how your RAG works". You must be able to answer confidently.

### If you do build it: "Ask FixMyCampus" (RAG-lite, ~90 min timebox)

**What it does:** a student or admin asks in plain language, and it answers from real issue data.
- "Are there any water problems in Hall 2?"
- "What's the status of the library WiFi issue?"
- (admin) "Which category has the most open complaints this week?"

**How it works (no vector DB needed):**
1. `POST /assistant/ask { "question": "..." }`
2. **Retrieve:** run a Postgres full-text + trigram search over title/description/location, take the top 8 issues, plus the `/stats` numbers.
3. **Augment:** put those records into a prompt: "Answer ONLY using these issues. Cite issue IDs. If not found, say so."
4. **Generate:** call a free-tier LLM API (Gemini or Groq). Return the answer + linked issue IDs.
5. Frontend: floating chat button, clickable issue links in the answer.

**Why no vector database:** the data is short, structured records. Keyword + filter retrieval is accurate, fast, and easy to explain. This is a strong answer if judges ask.

**Safety rules:**
- Put it behind an env flag `ENABLE_ASSISTANT=true` so you can switch it off instantly if it breaks.
- API key only on the backend, never in frontend code or GitHub.
- If it isn't working well by **12:30 AM, hide it** and don't mention it. Nobody loses points for a feature they never saw.
- Pitch it as an extra, not the core: "FixMyCampus works fully without AI; the assistant is an optional layer on top."

---

## 10. Frontend Pages

| Page | Who | Contents |
|---|---|---|
| `/login`, `/signup` | Public | Forms with inline errors; role select; admin code field appears only if Admin is chosen |
| `/issues` (home) | All | Search bar, filter dropdowns, sort, issue cards (title, category icon, location, status badge, priority badge, upvote count, comment count), pagination |
| `/report` | Student | Form (Building dropdown + optional room/spot) + soft duplicate warning + photo preview; reads `?location=` from URL (for QR codes) |
| `/issues/:id` | All | Full details, photo, upvote button, status timeline, comments; admin sees status control + delete; owner sees edit/delete |
| `/issues/:id/edit` | Owner | Pre-filled form (only while Open) |
| `/my-reports` | Student | Own issues with status summary counts at top |
| `/admin` | Admin | Stats cards, charts, top upvoted, avg resolution time, hotspots, QR generator |

**UX details that win the 15 UI points:** toasts for every action, skeleton loaders, colored status badges (Open = blue, In Progress = amber, Resolved = green), relative time ("3 hours ago"), category icons, and the upvote count updating instantly (optimistic update; roll back if the API fails).

---

## 11. Postman Testing

Create a collection **FixMyCampus API** with folders: Auth, Issues, Upvotes & Comments, Admin, Edge Cases.

Environment variables: `baseUrl`, `studentToken`, `adminToken`, `issueId`.

Auto-save the token after login (Login request → Tests tab):
```js
const json = pm.response.json();
pm.environment.set("studentToken", json.data.token);
```

**"Edge Cases" folder (screenshot each one for the deliverable):**
1. Create issue with empty title → 400 ✅ *(mandatory)*
2. Student changes status → 403 ✅ *(mandatory)*
3. Signup with existing email → 409
4. Upvote twice → toggles
5. Edit someone else's issue → 403
6. No token → 401
7. Student calls `/stats` → 403
8. Invalid category → 400

Export the collection as JSON and put it in the repo (`/docs/postman_collection.json`).

---

## 12. Deployment

1. **Supabase:** create project → run the SQL from Section 5 → create a public storage bucket `issue-photos` → copy the connection string.
2. **Render (backend):** New Web Service from GitHub → build `npm install` → start `node src/index.js` → add env vars: `DATABASE_URL`, `JWT_SECRET`, `ADMIN_SIGNUP_CODE`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `FRONTEND_URL`.
3. **Vercel (frontend):** import repo → set `VITE_API_URL` to the Render URL → add `vercel.json`:
   ```json
   { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
   ```
4. **CORS:** allow only `FRONTEND_URL` (plus `localhost` in development).
5. **Render free tier sleeps when idle.** The first request can take a while to wake it up. Open the live link a few minutes before your demo.
6. Test both logins on the live link after every redeploy.

**Backup plan:** if deployment breaks at the end, demo locally and show the recorded video. Never let deployment block the core demo.

---

## 13. Suggested Folder Structure

```
fixmycampus/
├── backend/
│   ├── src/
│   │   ├── index.js            # app setup, CORS, routes, error handler
│   │   ├── db.js               # pg Pool
│   │   ├── middleware/
│   │   │   ├── auth.js         # requireAuth (JWT check)
│   │   │   ├── role.js         # requireRole('admin')
│   │   │   └── validate.js     # zod schema → 400 with field messages
│   │   ├── routes/             # auth, issues, my, stats, assistant
│   │   └── utils/errors.js     # AppError class + error codes
│   ├── sql/schema.sql
│   ├── sql/seed.sql
│   └── .env.example            # commit this, NOT .env
├── frontend/
│   └── src/ (pages/, components/, api/client.js, context/AuthContext.jsx)
├── docs/postman_collection.json
└── README.md
```

---

## 14. Seed Data & Test Logins

| Role | Email | Password |
|---|---|---|
| Student | `student@fixmycampus.test` | `Student@123` |
| Student 2 | `student2@fixmycampus.test` | `Student@123` |
| Admin | `admin@fixmycampus.test` | `Admin@123` |

Seed ~20 realistic issues with real-sounding locations (e.g. "Hall 2, Room 214", "Library 3rd Floor", "CSE Building Washroom", "Cafeteria", "Main Gate Street Light"), mixed statuses, some upvotes and comments, and a few resolved ones with `resolved_at` set so the dashboard charts look alive in the demo.

---

## 15. Deliverables

### README must include
Project description · features list · tech stack · live links · test logins (table above) · API endpoint table · setup steps (`npm install`, `.env`, run) · screenshots · team members.

### 5 slides
1. **Problem:** WhatsApp groups and paper registers → lost complaints, duplicates, no feedback.
2. **Solution:** FixMyCampus: report → upvote → track → resolve, transparently.
3. **Features:** screenshots of home, report form with duplicate warning, admin dashboard.
4. **API & Architecture:** diagram (React → Express API with auth/role middleware → PostgreSQL) + 13 endpoints + DB schema.
5. **Impact & Future:** fewer duplicates, faster fixes, data for admins (hotspots, avg resolution time); future: notifications, QR codes across campus.

### Demo video script (2:30)
| Time | Show |
|---|---|
| 0:00–0:15 | Problem in one sentence + live link |
| 0:15–0:50 | Student: sign up, report issue, duplicate warning appears, upvote an existing one instead |
| 0:50–1:10 | Search + filters + sort by upvotes; priority badges |
| 1:10–1:40 | Admin: dashboard stats, change status with a note → timeline + official comment |
| 1:40–2:00 | Student sees the update in My Reports |
| 2:00–2:20 | Postman: empty title → 400, student status change → 403 |
| 2:20–2:30 | Closing line + dark mode/mobile view |

**Record the video by 1:15 AM at the latest.** Re-recording at 1:55 AM is a nightmare.

---

## 16. First-Hackathon Survival Rules

1. **`main` must always work.** Commit after every working feature. Never push `.env`.
2. **Stuck for 20+ minutes? Stop.** Ask your teammate, simplify the feature, or skip it.
3. **No big refactors after midnight.** Ugly code that works > beautiful code that's half done.
4. **Integration checkpoints** at 7:30, 9:30 and 11:30: stop and test together.
5. **Eat dinner. Drink water.** 10 hours is long; your brain at 1 AM matters.
6. **All three members must be able to explain** auth, role checks, the DB schema and the upvote logic. Judges often ask the person who didn't write that part.
7. **Screenshot everything as you go** (Postman, pages). Saves time at the end.
8. **Submit at 1:45 AM.** Upload servers get slow right before deadlines.

---

## 17. Right Now: First 30 Minutes (3 members)

**Minute 0–10: everyone together**
- [ ] Read Sections 0, 3, 4, 6 and 7 of this plan
- [ ] Decide stack (Section 2) based on what you already know
- [ ] Confirm who is A, B, C
- [ ] Set phone alarms: 7:30, 9:30, 11:30, 12:30, 1:15, 1:45

**Minute 10–30: in parallel**

Member C (start first, others need the repo):
- [ ] Create GitHub repo `fixmycampus`, add A and B as collaborators
- [ ] Push folders `backend/`, `frontend/`, `docs/` and a `.gitignore` (`node_modules`, `.env`)
- [ ] Create Supabase project, run the schema SQL from Section 5
- [ ] Create a public storage bucket `issue-photos`
- [ ] Share `DATABASE_URL` and Supabase keys with A in a private chat (never in Git)
- [ ] Make Render + Vercel accounts (log in with GitHub)

Member A:
- [ ] `cd backend && npm init -y`
- [ ] `npm install express pg bcrypt jsonwebtoken zod cors helmet express-rate-limit multer dotenv @supabase/supabase-js`
- [ ] `npm install -D nodemon`
- [ ] Create `.env` + `.env.example`, `src/index.js` with a `GET /health` route returning `{ ok: true }`
- [ ] Test `/health` in the browser

Member B:
- [ ] `npm create vite@latest frontend -- --template react`
- [ ] `cd frontend && npm install react-router-dom axios`
- [ ] Set up Tailwind (follow the official Vite guide)
- [ ] Create empty pages + routes from Section 10, and a `mockData.js` that matches the response shape in Section 6.1

**Minute 30: quick 2-minute sync.** Everyone runs the project locally, then go.

**Let's go. 🚀**
