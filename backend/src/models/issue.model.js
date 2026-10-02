// SQL for `issues` and `status_history`. See plan Sections 5 and 6.3 for the exact rules.
// RULE: always use parameters ($1, $2...) with the query() helper, never string concatenation.
//
// Every issue returned to the client has the same shape (matches frontend/src/mocks/mockData.js):
//   { id, title, description, category, location, photoUrl, status, upvoteCount, commentCount,
//     priority, hasUpvoted, createdBy: { id, name }, createdAt, updatedAt, resolvedAt }
// upvoteCount / commentCount are COUNTed every time (never stored), hasUpvoted is for the current user.

import { query, withTransaction } from '../config/db.js';
import { CATEGORIES, STATUSES } from '../utils/constants.js';

// ---------- shared pieces ----------

// The SELECT used by every query that returns issues. $1 is ALWAYS the id of the logged-in user
// (needed for hasUpvoted); put your own conditions after it.
const ISSUE_SELECT = `
  SELECT
    i.id, i.title, i.description, i.category, i.location, i.photo_url, i.status,
    i.created_by, u.name AS created_by_name,
    i.created_at, i.updated_at, i.resolved_at,
    (SELECT COUNT(*)::int FROM upvotes uv WHERE uv.issue_id = i.id) AS upvote_count,
    (SELECT COUNT(*)::int FROM comments c WHERE c.issue_id = i.id) AS comment_count,
    EXISTS (SELECT 1 FROM upvotes uv WHERE uv.issue_id = i.id AND uv.user_id = $1) AS has_upvoted
  FROM issues i
  JOIN users u ON u.id = i.created_by`;

// 10+ upvotes = High, 5-9 = Medium, otherwise Low (plan Section 8)
const priorityFor = (upvoteCount) => (upvoteCount >= 10 ? 'High' : upvoteCount >= 5 ? 'Medium' : 'Low');

// database row (snake_case) -> API object (camelCase)
function toIssue(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    location: row.location,
    photoUrl: row.photo_url,
    status: row.status,
    upvoteCount: row.upvote_count,
    commentCount: row.comment_count,
    priority: priorityFor(row.upvote_count),
    hasUpvoted: row.has_upvoted,
    createdBy: { id: row.created_by, name: row.created_by_name },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    resolvedAt: row.resolved_at,
  };
}

// The `sort` value is checked by zod AND looked up in this fixed list, so user text never reaches the SQL.
// "upvotes" (the default) breaks ties with the newest issue first.
const SORTS = {
  upvotes: 'upvote_count DESC, i.created_at DESC, i.id DESC',
  newest: 'i.created_at DESC, i.id DESC',
  oldest: 'i.created_at ASC, i.id ASC',
};

// Make "100%" or "a_b" search for those exact characters instead of acting as LIKE wildcards
const escapeLike = (text) => text.replace(/[\\%_]/g, '\\$&');

// Builds the WHERE part of GET /issues. Only "$n" placeholders go into the SQL text;
// the values go into `params`. `firstIndex` is the number of the first free placeholder.
function buildFilters({ q, category, status, location }, firstIndex) {
  const conditions = [];
  const params = [];
  const add = (value) => {
    params.push(value);
    return `$${firstIndex + params.length - 1}`;
  };

  if (q) {
    const like = add(`%${escapeLike(q)}%`);
    conditions.push(`(i.title ILIKE ${like} OR i.description ILIKE ${like} OR i.location ILIKE ${like})`);
  }
  if (category) conditions.push(`i.category = ${add(category)}`);
  if (status) conditions.push(`i.status = ${add(status)}`);
  if (location) conditions.push(`i.location ILIKE ${add(`%${escapeLike(location)}%`)}`);

  return { where: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '', params };
}

// ---------- issues ----------

// Create an issue (status defaults to 'Open') AND its first status_history row, in one transaction.
// Returns the new issue in the API shape.
export async function createIssue({ title, description, category, location, photoUrl, createdBy }) {
  const id = await withTransaction(async (client) => {
    const inserted = await client.query(
      `INSERT INTO issues (title, description, category, location, photo_url, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [title, description, category, location, photoUrl, createdBy],
    );
    const issueId = inserted.rows[0].id;

    await client.query(
      `INSERT INTO status_history (issue_id, old_status, new_status, changed_by)
       VALUES ($1, NULL, 'Open', $2)`,
      [issueId, createdBy],
    );
    return issueId;
  });

  return findById(id, createdBy);
}

// GET /issues: search, filters, sort and pagination. Returns { items, total }.
export async function listIssues({ q, category, status, location, sort, page, limit, userId }) {
  // The list query uses $1 for userId, so its filters start at $2. The count query has no userId.
  const listFilters = buildFilters({ q, category, status, location }, 2);
  const countFilters = buildFilters({ q, category, status, location }, 1);

  const limitIndex = 2 + listFilters.params.length;
  const listSql = `${ISSUE_SELECT}
    ${listFilters.where}
    ORDER BY ${SORTS[sort]}
    LIMIT $${limitIndex} OFFSET $${limitIndex + 1}`;
  const listParams = [userId, ...listFilters.params, limit, (page - 1) * limit];

  const [list, count] = await Promise.all([
    query(listSql, listParams),
    query(`SELECT COUNT(*)::int AS total FROM issues i ${countFilters.where}`, countFilters.params),
  ]);

  return { items: list.rows.map(toIssue), total: count.rows[0].total };
}

// One issue with counts + hasUpvoted for `userId`, or null if it does not exist
export async function findById(id, userId) {
  const result = await query(`${ISSUE_SELECT} WHERE i.id = $2`, [userId, id]);
  return result.rows[0] ? toIssue(result.rows[0]) : null;
}

// Update the editable fields. status is NOT editable here (only PATCH /issues/:id/status changes it).
// `photoUrl` null means "keep the current photo". The AND status = 'Open' makes the edit fail safely
// if an admin changed the status a moment ago: then nothing is updated and we return false.
// Returns true when the issue was updated.
export async function updateIssue(id, { title, description, category, location, photoUrl }) {
  const result = await query(
    `UPDATE issues
     SET title = $2, description = $3, category = $4, location = $5,
         photo_url = COALESCE($6, photo_url), updated_at = now()
     WHERE id = $1 AND status = 'Open'
     RETURNING id`,
    [id, title, description, category, location, photoUrl],
  );
  return result.rowCount === 1;
}

// Delete an issue. Its comments, upvotes and status history disappear too (ON DELETE CASCADE).
// Returns { photoUrl } of the deleted issue (so the photo file can be removed), or null if it did not exist.
export async function deleteIssue(id) {
  const result = await query('DELETE FROM issues WHERE id = $1 RETURNING photo_url', [id]);
  return result.rows[0] ? { photoUrl: result.rows[0].photo_url } : null;
}

// SELECT status_history rows for an issue (oldest first) with the name of who changed it
export async function listStatusHistory(issueId) {
  const result = await query(
    `SELECT h.id, h.old_status, h.new_status, h.note, h.changed_at,
            u.id AS changed_by_id, u.name AS changed_by_name
     FROM status_history h
     JOIN users u ON u.id = h.changed_by
     WHERE h.issue_id = $1
     ORDER BY h.changed_at ASC, h.id ASC`,
    [issueId],
  );
  return result.rows.map((row) => ({
    id: row.id,
    oldStatus: row.old_status,
    newStatus: row.new_status,
    note: row.note,
    changedAt: row.changed_at,
    changedBy: { id: row.changed_by_id, name: row.changed_by_name },
  }));
}


// ---------- my issues, status changes, similar issues, stats ----------

// GET /my/issues: the issues created by `userId`, newest first (same item shape as the list),
// plus how many of them are in each status: { Open, "In Progress", Resolved, total }.
// The counts are taken from the same rows as the items, so the two can never disagree.
export async function listByUser(userId) {
  const result = await query(
    `${ISSUE_SELECT} WHERE i.created_by = $2 ORDER BY i.created_at DESC, i.id DESC`,
    [userId, userId],
  );
  const items = result.rows.map(toIssue);

  const counts = Object.fromEntries(STATUSES.map((status) => [status, 0]));
  for (const issue of items) counts[issue.status] += 1;
  counts.total = items.length;

  return { items, counts };
}

// PATCH status, all in ONE transaction (all saved or nothing):
//   1. UPDATE the issue: new status, updated_at, resolved_at (now() when Resolved, NULL otherwise = reopen)
//   2. INSERT a status_history row
//   3. if there is a `commentText`, INSERT it as a comment by the admin (shown with the "Official" badge)
// The AND status = $3 makes it safe against two admins clicking at once: if the status is no longer
// `oldStatus`, nothing is changed and we return false (the controller answers 409).
export async function updateStatus(id, { oldStatus, newStatus, note, commentText, changedBy }) {
  return withTransaction(async (client) => {
    const updated = await client.query(
      `UPDATE issues
       SET status = $2,
           updated_at = now(),
           resolved_at = CASE WHEN $4::boolean THEN now() ELSE NULL END
       WHERE id = $1 AND status = $3
       RETURNING id`,
      [id, newStatus, oldStatus, newStatus === 'Resolved'],
    );
    if (updated.rowCount === 0) return false;

    await client.query(
      `INSERT INTO status_history (issue_id, old_status, new_status, changed_by, note)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, oldStatus, newStatus, changedBy, note],
    );

    if (commentText) {
      await client.query('INSERT INTO comments (issue_id, user_id, text) VALUES ($1, $2, $3)', [id, changedBy, commentText]);
    }
    return true;
  });
}

// GET /issues/similar: up to 3 possible duplicates. An issue matches only if ALL of these are true:
//   - same category
//   - same building (case-insensitive). The building is the part of the location before the first comma,
//     so "Hall 2, Room 214" has building "Hall 2". We cut the search value the same way, so passing
//     a full location also works.
//   - not Resolved (the problem may have come back)
//   - title similarity > 0.2 (pg_trgm, the extension created in schema.sql)
// Most similar first.
export async function findSimilar({ title, category, building, userId }) {
  const result = await query(
    `${ISSUE_SELECT}
     WHERE i.status <> 'Resolved'
       AND i.category = $3
       AND lower(trim(split_part(i.location, ',', 1))) = lower(trim(split_part($4, ',', 1)))
       AND similarity(i.title, $2) > 0.2
     ORDER BY similarity(i.title, $2) DESC, i.id DESC
     LIMIT 3`,
    [userId, title, category, building],
  );
  return result.rows.map(toIssue);
}

// GET /stats numbers for the admin dashboard (plan Section 6.3). Every group is listed even when it is 0.
export async function getStats() {
  const [statusRows, categoryRows, topRows, avgRow, recentRow, locationRows] = await Promise.all([
    query('SELECT status, COUNT(*)::int AS n FROM issues GROUP BY status'),
    query('SELECT category, COUNT(*)::int AS n FROM issues GROUP BY category'),
    // most upvoted issues (only issues that have at least one upvote)
    query(
      `SELECT i.id, i.title, COUNT(uv.user_id)::int AS upvote_count
       FROM issues i
       JOIN upvotes uv ON uv.issue_id = i.id
       GROUP BY i.id
       ORDER BY upvote_count DESC, i.created_at DESC
       LIMIT 5`,
    ),
    // average hours from report to resolution; AVG of no rows is NULL, so this is null until something is resolved
    query(
      `SELECT ROUND(AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600)::numeric, 1) AS avg_hours
       FROM issues
       WHERE status = 'Resolved' AND resolved_at IS NOT NULL`,
    ),
    query(
      `SELECT COUNT(*)::int AS n
       FROM issues
       WHERE status = 'Resolved' AND resolved_at >= now() - interval '7 days'`,
    ),
    // "hotspots": the buildings with the most issues (building = location text before the first comma)
    query(
      `SELECT trim(split_part(location, ',', 1)) AS building, COUNT(*)::int AS n
       FROM issues
       GROUP BY building
       ORDER BY n DESC, building ASC
       LIMIT 5`,
    ),
  ]);

  const byStatus = Object.fromEntries(STATUSES.map((status) => [status, 0]));
  for (const row of statusRows.rows) byStatus[row.status] = row.n;

  const byCategory = Object.fromEntries(CATEGORIES.map((category) => [category, 0]));
  for (const row of categoryRows.rows) byCategory[row.category] = row.n;

  const avgHours = avgRow.rows[0].avg_hours; // numeric comes back as a string, or null

  return {
    total: Object.values(byStatus).reduce((sum, n) => sum + n, 0),
    byStatus,
    byCategory,
    topUpvoted: topRows.rows.map((row) => ({ id: row.id, title: row.title, upvoteCount: row.upvote_count })),
    avgResolutionHours: avgHours === null ? null : Number(avgHours),
    resolvedLast7Days: recentRow.rows[0].n,
    topLocations: locationRows.rows.map((row) => ({ location: row.building, count: row.n })),
  };
}
