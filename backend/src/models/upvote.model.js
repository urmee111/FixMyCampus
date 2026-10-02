// SQL for the `upvotes` table. PRIMARY KEY (issue_id, user_id) guarantees one upvote per user.
// RULE: always use parameters ($1, $2...) with the query() helper, never string concatenation.
//
// TODO (Member A): implement.

import { query } from '../config/db.js';

// Toggle: if a row exists DELETE it, else INSERT it. Return { upvoted: true|false }.
export async function toggleUpvote(issueId, userId) {
  throw new Error('TODO: toggleUpvote');
}

// SELECT COUNT(*) FROM upvotes WHERE issue_id = $1   (the count is never stored, always computed)
export async function countByIssue(issueId) {
  throw new Error('TODO: countByIssue');
}
