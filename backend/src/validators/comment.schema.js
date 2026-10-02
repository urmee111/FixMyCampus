// Validation for POST /issues/:id/comments (plan Section 7 "Comments").
// The :id in the URL is checked with idParamSchema from issue.schema.js.

import { z } from 'zod';

export const createCommentSchema = z.object({
  text: z
    .string({ error: 'Comment is required' })
    .trim() // whitespace-only becomes "" and fails the next rule
    .min(1, 'Comment is required')
    .max(500, 'Comment must be at most 500 characters'),
});
