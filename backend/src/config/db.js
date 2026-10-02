// PostgreSQL connection pool (plain SQL with the `pg` package, no ORM).
// The pool connects lazily, so the server can start even if the database is down.

import pg from 'pg';
import { env } from './env.js';

// Supabase (and most hosted databases) require SSL. Local Postgres does not.
const isLocal = /localhost|127\.0\.0\.1/.test(env.databaseUrl || '');

export const pool = new pg.Pool({
  connectionString: env.databaseUrl,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

// Without this handler an idle-connection error would crash the whole server.
pool.on('error', (err) => {
  console.error('Unexpected database error:', err.message);
});

// Shortcut used by the models:  await query('SELECT * FROM users WHERE id = $1', [id])
// ALWAYS pass user input in the params array ($1, $2...), never inside the SQL string.
export const query = (text, params) => pool.query(text, params);
