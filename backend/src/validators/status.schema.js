// Validation for PATCH /issues/:id/status (plan Section 6.3).
// "Same status as current" (400) and the allowed transitions are checked in the controller,
// because they need the current status from the database.

import { z } from 'zod';
import { STATUSES } from '../utils/constants.js';

export const updateStatusSchema = z.object({
  status: z.enum(STATUSES, { error: `Status must be one of: ${STATUSES.join(', ')}` }),
  // Optional admin note: saved in status_history and posted as an "Official" comment
  note: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.string().trim().max(300, 'Note must be at most 300 characters').optional(),
  ),
});
