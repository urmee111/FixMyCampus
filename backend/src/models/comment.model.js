// SQL for the `comments` table.
// RULE: always use parameters ($1, $2...) with the query() helper, never string concatenation.

import { query } from '../config/db.js';

// database row -> API object. `user.role` lets the UI show an "Official" badge on admin comments.
const toComment = (row) => ({
  id: row.id,
  text: row.text,
  createdAt: row.created_at,
  user: { id: row.user_id, name: row.user_name, role: row.user_role },
});

// Comments of one issue, oldest first, joined with users (name + role)
export async function listByIssue(issueId) {
  const result = await query(
    `SELECT c.id, c.text, c.created_at,
            u.id AS user_id, u.name AS user_name, u.role AS user_role
     FROM comments c
     JOIN users u ON u.id = c.user_id
     WHERE c.issue_id = $1
     ORDER BY c.created_at ASC, c.id ASC`,
    [issueId],
  );
  return result.rows.map(toComment);
}

// Save a comment and return it in the same shape as listByIssue.
// If the issue does not exist the INSERT fails with a foreign key error, which errorHandler turns into 404.
export async function createComment({ issueId, userId, text }) {
  const result = await query(
    `WITH inserted AS (
       INSERT INTO comments (issue_id, user_id, text)
       VALUES ($1, $2, $3)
       RETURNING id, text, created_at, user_id
     )
     SELECT inserted.id, inserted.text, inserted.created_at,
            u.id AS user_id, u.name AS user_name, u.role AS user_role
     FROM inserted
     JOIN users u ON u.id = inserted.user_id`,
    [issueId, userId, text],
  );
  return toComment(result.rows[0]);
}
