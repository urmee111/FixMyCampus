// Issue endpoints (plan Section 6.2). All are STUBS that return 501 for now.
// req.user = { id, role } comes from requireAuth. Clean input is in req.validated.body / .query / .params.

import { asyncHandler } from '../utils/asyncHandler.js';
import { fail } from '../utils/response.js';

const notImplemented = (res) => fail(res, 501, 'NOT_IMPLEMENTED', 'TODO');

// POST /issues -> 201 issue
export const createIssue = asyncHandler(async (req, res) => {
  // TODO: if req.file, upload req.file.buffer to Supabase Storage (config/supabase.js) and keep the public URL
  // TODO: insert the issue + first status_history row
  notImplemented(res);
});

// GET /issues -> 200 { items, page, limit, total, totalPages }  (empty list is 200, not 404)
export const listIssues = asyncHandler(async (req, res) => {
  // TODO: issue.model.listIssues(req.validated.query + userId) and build the pagination numbers
  notImplemented(res);
});

// GET /issues/similar -> 200 up to 3 possibly-duplicate issues
export const findSimilar = asyncHandler(async (req, res) => {
  // TODO: issue.model.findSimilar(req.validated.query)
  notImplemented(res);
});

// GET /issues/:id -> 200 issue + comments + status history
export const getIssue = asyncHandler(async (req, res) => {
  // TODO: 404 if not found; load comments (comment.model) and history (issue.model.listStatusHistory)
  notImplemented(res);
});

// PUT /issues/:id -> 200 issue (owner only)
export const updateIssue = asyncHandler(async (req, res) => {
  // TODO: 404 if missing; 403 if not the owner; 409 "Only open issues can be edited" if status is not Open
  notImplemented(res);
});

// DELETE /issues/:id -> 200 (owner or admin)
export const deleteIssue = asyncHandler(async (req, res) => {
  // TODO: 404 if missing; 403 unless owner or admin
  notImplemented(res);
});

// POST /issues/:id/upvote -> 200 { upvoted, upvoteCount }  (students only, route already checks the role)
export const toggleUpvote = asyncHandler(async (req, res) => {
  // TODO: 404 if missing; 400 "You can't upvote your own issue"; 400 if the issue is Resolved
  // TODO: upvote.model.toggleUpvote, then return the fresh count
  notImplemented(res);
});

// PATCH /issues/:id/status -> 200 issue  (admin only, route already checks the role)
export const updateStatus = asyncHandler(async (req, res) => {
  // TODO: 404 if missing; 400 if same status; allowed: Open->In Progress, Open->Resolved,
  //       In Progress->Resolved, Resolved->Open
  // TODO: set resolved_at, insert status_history, and post the note as an "Official" admin comment
  notImplemented(res);
});
