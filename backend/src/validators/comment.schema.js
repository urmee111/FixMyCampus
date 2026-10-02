// Validation for POST /issues/:id/comments (plan Section 7 "Comments").
// The :id in the URL is checked with idParamSchema from issue.schema.js.

import { z } from 'zod';

const EMPTY_MESSAGE = 'Comment cannot be empty';

export const createCommentSchema = z.object({
  text: z
    .string({ error: EMPTY_MESSAGE }) // field missing or not text
    .trim() // whitespace-only becomes "" and fails the next rule
    .min(1, EMPTY_MESSAGE)
    .max(500, 'Comment must be at most 500 characters'),
});
