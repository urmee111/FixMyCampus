# FixMyCampus Frontend

The web app of FixMyCampus: students report campus problems, upvote them and follow their status; staff / admins update the status and see statistics. It talks to the FixMyCampus REST API.

## Stack

React 19, Vite, Tailwind CSS 3, react-router-dom, lucide-react. Plain JavaScript (ES modules).

## Run it

```bash
cd frontend
npm install
cp .env.example .env     # then set VITE_API_BASE_URL
npm run dev              # http://localhost:5173
npm run build            # production build into dist/
```

`.env` has one setting, `VITE_API_BASE_URL`: the address of the backend, for example `http://localhost:5000`. It is public configuration, never put secrets in it.

## Folders

- `src/api/` one function per backend endpoint
- `src/pages/` one file per page, `src/components/` shared UI
- `src/lib/` constants (categories, statuses, campus locations), formatters, validators
- `src/styles/tokens.css` the colour theme (light and dark)

Priority labels (High: 5 or more upvotes, Medium: 3 or 4, Low is not shown) are worked out in `src/lib/formatters.js`.
