// SQL for the `upvotes` table. PRIMARY KEY (issue_id, user_id) guarantees one upvote per user,
// even if the same user double-clicks or two requests arrive at the same moment.
// RULE: always use parameters ($1, $2...) with the query() helper, never string concatenation.

import { query } from '../config/db.js';

// Toggle: if the user's upvote exists, DELETE it; otherwise INSERT it. Returns { upvoted: true|false }.
// ON CONFLICT DO NOTHING covers the double-click case: if two requests both try to insert,
// the database keeps just one row and the other insert is silently ignored.
export async function toggleUpvote(issueId, userId) {
  const removed = await query('DELETE FROM upvotes WHERE issue_id = $1 AND user_id = $2', [issueId, userId]);
  if (removed.rowCount === 1) return { upvoted: false };

  await query(
    'INSERT INTO upvotes (issue_id, user_id) VALUES ($1, $2) ON CONFLICT (issue_id, user_id) DO NOTHING',
    [issueId, userId],
  );
  return { upvoted: true };
}

// How many upvotes an issue has (the count is never stored, always computed)
export async function countByIssue(issueId) {
  const result = await query('SELECT COUNT(*)::int AS count FROM upvotes WHERE issue_id = $1', [issueId]);
  return result.rows[0].count;
}
