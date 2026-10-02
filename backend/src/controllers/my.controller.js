// "My" endpoints (plan Section 6.2, #11). STUB: returns 501 for now.

import { asyncHandler } from '../utils/asyncHandler.js';
import { fail } from '../utils/response.js';

// GET /my/issues -> 200 list of the logged-in user's issues
export const getMyIssues = asyncHandler(async (req, res) => {
  // TODO: issue.model.listByUser(req.user.id)
  fail(res, 501, 'NOT_IMPLEMENTED', 'TODO');
});
