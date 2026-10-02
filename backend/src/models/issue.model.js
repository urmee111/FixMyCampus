// SQL for `issues` and `status_history`. See plan Sections 5 and 6.3 for the exact rules.
// RULE: always use parameters ($1, $2...) with the query() helper, never string concatenation.
//
// Every issue returned to the client should include:
//   upvoteCount (COUNT of upvotes), commentCount, priority (computed), hasUpvoted (for the current user)
//
// TODO (Member A): implement.

import { query } from '../config/db.js';

// INSERT a new issue (status defaults to 'Open'), also insert the first status_history row
export async function createIssue({ title, description, category, location, photoUrl, createdBy }) {
  throw new Error('TODO: createIssue');
}

// GET /issues: search (ILIKE on title, description, location), filters, sort, LIMIT/OFFSET.
// Return { items, total } so the controller can build page / totalPages.
export async function listIssues({ q, category, status, location, sort, page, limit, userId }) {
  throw new Error('TODO: listIssues');
}

// One issue with counts + hasUpvoted for `userId`, or null if not found
export async function findById(id, userId) {
  throw new Error('TODO: findById');
}

// UPDATE title, description, category, location, photo_url, updated_at = now() WHERE id = $1
export async function updateIssue(id, fields) {
  throw new Error('TODO: updateIssue');
}

// DELETE FROM issues WHERE id = $1   (comments, upvotes, history are removed by ON DELETE CASCADE)
export async function deleteIssue(id) {
  throw new Error('TODO: deleteIssue');
}

// GET /issues/similar: same category + same building (case-insensitive), status <> 'Resolved',
// similarity(title, $1) > 0.2 (pg_trgm), ORDER BY similarity DESC LIMIT 3
export async function findSimilar({ title, category, building }) {
  throw new Error('TODO: findSimilar');
}

// GET /my/issues: issues where created_by = $1, newest first
export async function listByUser(userId) {
  throw new Error('TODO: listByUser');
}

// PATCH status: UPDATE status, updated_at, resolved_at (now() on Resolved, NULL on reopen)
// and INSERT a status_history row. Use ONE transaction for both.
export async function updateStatus(id, { newStatus, note, changedBy }) {
  throw new Error('TODO: updateStatus');
}

// SELECT status_history rows for an issue (oldest first) with the name of who changed it
export async function listStatusHistory(issueId) {
  throw new Error('TODO: listStatusHistory');
}

// GET /stats numbers: total, byStatus, byCategory, topUpvoted, avgResolutionHours,
// resolvedLast7Days, topLocations (see plan Section 6.3). avgResolutionHours is null if nothing is resolved.
export async function getStats() {
  throw new Error('TODO: getStats');
}
