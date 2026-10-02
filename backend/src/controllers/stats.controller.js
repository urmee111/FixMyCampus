// Admin statistics (plan Section 6.2 #12 and 6.3).

import * as issueModel from '../models/issue.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/response.js';

// GET /stats -> 200 stats  (admin only, the route already checks the role)
// avgResolutionHours is null (not an error) until at least one issue has been resolved.
export const getStats = asyncHandler(async (req, res) => {
  ok(res, await issueModel.getStats());
});
