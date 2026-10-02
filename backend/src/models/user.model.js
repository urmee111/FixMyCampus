// SQL for the `users` table. Controllers call these functions; they never write SQL themselves.
// RULE: always use parameters ($1, $2...) with the query() helper, never string concatenation.
//
// TODO (Member A): implement. Remember password_hash must NEVER be sent in an API response.

import { query } from '../config/db.js';

// INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at
export async function createUser({ name, email, passwordHash, role }) {
  throw new Error('TODO: createUser');
}

// SELECT * FROM users WHERE email = $1   (email is already lowercased by the validator)
export async function findByEmail(email) {
  throw new Error('TODO: findByEmail');
}

// SELECT id, name, email, role, created_at FROM users WHERE id = $1
export async function findById(id) {
  throw new Error('TODO: findById');
}
