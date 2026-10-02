// SQL for the `comments` table.
// RULE: always use parameters ($1, $2...) with the query() helper, never string concatenation.
//
// TODO (Member A): implement.

import { query } from '../config/db.js';

// INSERT INTO comments (issue_id, user_id, text) VALUES ($1, $2, $3) RETURNING ...
export async function createComment({ issueId, userId, text }) {
  throw new Error('TODO: createComment');
}

// Comments of one issue, oldest first, joined with users (name + role so the UI can show an "Official" badge for admins)
export async function listByIssue(issueId) {
  throw new Error('TODO: listByIssue');
}
