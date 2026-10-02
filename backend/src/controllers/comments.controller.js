// Comment endpoint (plan Section 6.2, #9). STUB: returns 501 for now.

import { asyncHandler } from '../utils/asyncHandler.js';
import { fail } from '../utils/response.js';

// POST /issues/:id/comments -> 201 comment
export const createComment = asyncHandler(async (req, res) => {
  // TODO: 404 if the issue does not exist; save req.validated.body.text for req.user.id
  // TODO: students may still comment on Resolved issues
  fail(res, 501, 'NOT_IMPLEMENTED', 'TODO');
});
