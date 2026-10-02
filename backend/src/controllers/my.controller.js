// "My" endpoints (plan Section 6.2, #11).

import * as issueModel from '../models/issue.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/response.js';

// GET /my/issues -> 200 { items, counts }
//   items:  the logged-in user's own issues, newest first (same shape as GET /issues)
//   counts: { Open, "In Progress", Resolved, total } for the status summary at the top of "My Reports"
export const getMyIssues = asyncHandler(async (req, res) => {
  const { items, counts } = await issueModel.listByUser(req.user.id);
  ok(res, { items, counts });
});
