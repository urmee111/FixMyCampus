// /issues/*  (every route needs a logged-in user)
// Middleware order on each route:  auth -> role -> upload -> validate -> controller

import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { validate } from '../middleware/validate.js';
import { uploadPhoto } from '../middleware/upload.js';
import {
  createIssueSchema,
  updateIssueSchema,
  idParamSchema,
  listIssuesQuerySchema,
  similarQuerySchema,
} from '../validators/issue.schema.js';
import { createCommentSchema } from '../validators/comment.schema.js';
import { updateStatusSchema } from '../validators/status.schema.js';
import {
  createIssue,
  listIssues,
  findSimilar,
  getIssue,
  updateIssue,
  deleteIssue,
  toggleUpvote,
  updateStatus,
} from '../controllers/issues.controller.js';
import { createComment } from '../controllers/comments.controller.js';

const router = Router();

router.use(requireAuth); // everything below needs a valid token

router.post('/', uploadPhoto, validate(createIssueSchema), createIssue); // #3
router.get('/', validate(listIssuesQuerySchema, 'query'), listIssues); // #4

// ⚠️ MUST stay above '/:id', otherwise Express reads "similar" as an id
router.get('/similar', validate(similarQuerySchema, 'query'), findSimilar); // #13

router.get('/:id', validate(idParamSchema, 'params'), getIssue); // #5
// "Owner only" is checked in the controller (it needs the issue from the database)
router.put(
  '/:id',
  validate(idParamSchema, 'params'),
  uploadPhoto,
  validate(updateIssueSchema),
  updateIssue,
); // #6
// "Owner or admin" is checked in the controller
router.delete('/:id', validate(idParamSchema, 'params'), deleteIssue); // #7

router.post(
  '/:id/upvote',
  requireRole('student', 'Only students can upvote issues'),
  validate(idParamSchema, 'params'),
  toggleUpvote,
); // #8

router.post(
  '/:id/comments',
  validate(idParamSchema, 'params'),
  validate(createCommentSchema),
  createComment,
); // #9

router.patch(
  '/:id/status',
  requireRole('admin', 'Only admins can change status'),
  validate(idParamSchema, 'params'),
  validate(updateStatusSchema),
  updateStatus,
); // #10

export default router;
