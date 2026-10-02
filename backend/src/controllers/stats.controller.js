// Admin statistics (plan Section 6.2 #12 and 6.3). STUB: returns 501 for now.

import { asyncHandler } from '../utils/asyncHandler.js';
import { fail } from '../utils/response.js';

// GET /stats -> 200 stats  (admin only, route already checks the role)
export const getStats = asyncHandler(async (req, res) => {
  // TODO: issue.model.getStats(); avgResolutionHours must be null (not a crash) when nothing is resolved
  fail(res, 501, 'NOT_IMPLEMENTED', 'TODO');
});
