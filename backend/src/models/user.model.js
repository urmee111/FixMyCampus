// SQL for the `users` table. Controllers call these functions; they never write SQL themselves.
// RULE: always use parameters ($1, $2...) with the query() helper, never string concatenation.
//
// password_hash must NEVER be sent in an API response. Only findByEmail returns it,
// and only because the login controller needs it to check the password.

import { query } from '../config/db.js';

// Insert a new user. Throws a Postgres error with code '23505' if the email already exists
// (the controller turns that into 409). Returns the new user WITHOUT password_hash.
export async function createUser({ name, email, passwordHash, role }) {
  const result = await query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at`,
    [name, email, passwordHash, role],
  );
  return result.rows[0];
}

// Find a user by email (already trimmed + lowercased by the validator).
// Returns the row INCLUDING password_hash (for login only), or null if there is no such user.
export async function findByEmail(email) {
  const result = await query(
    `SELECT id, name, email, password_hash, role, created_at
     FROM users
     WHERE email = $1`,
    [email],
  );
  return result.rows[0] || null;
}

// Find a user by id, WITHOUT password_hash. Returns null if not found.
export async function findById(id) {
  const result = await query(
    `SELECT id, name, email, role, created_at
     FROM users
     WHERE id = $1`,
    [id],
  );
  return result.rows[0] || null;
}
