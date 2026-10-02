// Issue endpoints (plan Section 6.2): create, list, similar, get one, update, delete, upvote, status.
// req.user = { id, role } comes from requireAuth. Clean input is in req.validated.body / .query / .params.
// A photo (optional) arrives as req.file (see middleware/upload.js).

import * as issueModel from '../models/issue.model.js';
import * as commentModel from '../models/comment.model.js';
import * as upvoteModel from '../models/upvote.model.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { STATUS_TRANSITIONS } from '../utils/constants.js';
import { deletePhoto, uploadPhoto } from '../utils/photoStorage.js';
import { ok } from '../utils/response.js';

// Loads an issue or stops with 404. Used by get / update / delete / upvote / status.
async function loadIssueOr404(id, userId) {
  const issue = await issueModel.findById(id, userId);
  if (!issue) throw AppError.notFound('Issue not found');
  return issue;
}

// POST /issues -> 201 issue
export const createIssue = asyncHandler(async (req, res) => {
  const { title, description, category, location } = req.validated.body;
  const userId = req.user.id;

  // The photo is uploaded first because we need its URL for the INSERT
  const photoUrl = req.file ? await uploadPhoto(req.file, userId) : null;

  let issue;
  try {
    issue = await issueModel.createIssue({ title, description, category, location, photoUrl, createdBy: userId });
  } catch (err) {
    await deletePhoto(photoUrl); // don't leave an unused file in the bucket
    throw err; // errorHandler turns known database errors (e.g. a deleted user) into 4xx
  }

  ok(res, issue, 201);
});

// GET /issues -> 200 { items, page, limit, total, totalPages }  (empty list is 200, not 404)
export const listIssues = asyncHandler(async (req, res) => {
  const { page, limit } = req.validated.query;
  const { items, total } = await issueModel.listIssues({ ...req.validated.query, userId: req.user.id });

  // An empty result still counts as 1 page, so the UI never shows "Page 1 of 0"
  const totalPages = Math.max(1, Math.ceil(total / limit));
  ok(res, { items, page, limit, total, totalPages });
});

// GET /issues/similar -> 200 with an ARRAY of up to 3 possible duplicates, [] when there are none.
// Each one is { id, title, location, status, upvoteCount }. Same category + building, not Resolved.
export const findSimilar = asyncHandler(async (req, res) => {
  ok(res, await issueModel.findSimilar(req.validated.query));
});

// GET /issues/:id -> 200 issue + comments + status history
export const getIssue = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const issue = await loadIssueOr404(id, req.user.id);

  const [comments, history] = await Promise.all([
    commentModel.listByIssue(id),
    issueModel.listStatusHistory(id),
  ]);

  ok(res, { ...issue, comments, history });
});

// PUT /issues/:id -> 200 issue (owner only, and only while the issue is Open)
// A new photo replaces the old one; no photo in the request keeps the current one.
export const updateIssue = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const { title, description, category, location } = req.validated.body;
  const userId = req.user.id;

  const issue = await loadIssueOr404(id, userId);
  // Check the owner BEFORE the status, so strangers learn nothing about other people's issues
  if (issue.createdBy.id !== userId) throw AppError.forbidden('You can only edit your own issues');
  if (issue.status !== 'Open') throw AppError.conflict('Only open issues can be edited');

  const newPhotoUrl = req.file ? await uploadPhoto(req.file, userId) : null;

  let updated;
  try {
    updated = await issueModel.updateIssue(id, { title, description, category, location, photoUrl: newPhotoUrl });
  } catch (err) {
    await deletePhoto(newPhotoUrl);
    throw err;
  }

  // false = an admin changed the status between our check and the update, so nothing was saved
  if (!updated) {
    await deletePhoto(newPhotoUrl);
    throw AppError.conflict('Only open issues can be edited');
  }

  if (newPhotoUrl) await deletePhoto(issue.photoUrl); // the replaced photo is no longer needed

  ok(res, await issueModel.findById(id, userId));
});

// DELETE /issues/:id -> 200 { id, deleted: true }  (owner, or any admin for moderation)
export const deleteIssue = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const issue = await loadIssueOr404(id, req.user.id);

  const isOwner = issue.createdBy.id === req.user.id;
  if (!isOwner && req.user.role !== 'admin') {
    throw AppError.forbidden('You can only delete your own issues');
  }

  const deleted = await issueModel.deleteIssue(id);
  if (!deleted) throw AppError.notFound('Issue not found'); // somebody deleted it a moment ago

  await deletePhoto(deleted.photoUrl);
  ok(res, { id, deleted: true });
});

// POST /issues/:id/upvote -> 200 { upvoted, upvoteCount }
// Students only (the route already rejects admins with 403). Calling it again removes the upvote (toggle).
export const toggleUpvote = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const userId = req.user.id;

  const issue = await loadIssueOr404(id, userId);
  if (issue.createdBy.id === userId) throw AppError.validation("You can't upvote your own issue");
  if (issue.status === 'Resolved') throw AppError.validation('Resolved issues can no longer be upvoted');

  const { upvoted } = await upvoteModel.toggleUpvote(id, userId);
  const upvoteCount = await upvoteModel.countByIssue(id); // always the fresh count

  ok(res, { upvoted, upvoteCount });
});

// PATCH /issues/:id/status -> 200 issue
// Admin only (the route already rejects students with 403).
// Allowed: Open -> In Progress, Open -> Resolved, In Progress -> Resolved, Resolved -> Open (reopen).
// The model also saves a status_history row, sets/clears resolved_at, and posts the optional note as an
// admin comment ("Status changed to <status>: <note>", shown with the "Official" badge), all in one transaction.
export const updateStatus = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const { status: newStatus, note } = req.validated.body;
  const adminId = req.user.id;

  const issue = await loadIssueOr404(id, adminId);

  if (issue.status === newStatus) {
    const message = `Issue is already ${newStatus}`;
    throw AppError.validation(message, { status: message });
  }

  const allowed = STATUS_TRANSITIONS[issue.status];
  if (!allowed.includes(newStatus)) {
    const message = `Cannot change status from "${issue.status}" to "${newStatus}". Allowed: ${allowed.join(', ')}`;
    throw AppError.validation(message, { status: message });
  }

  const changed = await issueModel.updateStatus(id, {
    oldStatus: issue.status,
    newStatus,
    note: note || null, // no note (or a blank one) means no history note and no comment
    // the note is also posted as an admin comment, e.g. "Status changed to In Progress: Electrician assigned"
    commentText: note ? `Status changed to ${newStatus}: ${note}` : null,
    changedBy: adminId,
  });
  // false = another admin changed the status a moment ago, so nothing was saved
  if (!changed) throw AppError.conflict('The status was just changed by someone else. Please reload and try again');

  ok(res, await issueModel.findById(id, adminId));
});
