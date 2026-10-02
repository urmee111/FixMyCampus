// Comment endpoint (plan Section 6.2, #9).

import * as commentModel from '../models/comment.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/response.js';

// POST /issues/:id/comments -> 201 comment { id, text, createdAt, user: { id, name, role } }
// Any logged-in user can comment, also on Resolved issues (students can say "still broken!").
// A comment on an issue that does not exist fails in the database and errorHandler answers 404.
export const createComment = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const { text } = req.validated.body;

  const comment = await commentModel.createComment({ issueId: id, userId: req.user.id, text });
  ok(res, comment, 201);
});
