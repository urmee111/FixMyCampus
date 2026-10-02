// Health check. Render calls it to see if the service is alive, and so can we.

import { pingDatabase } from '../models/health.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, fail } from '../utils/response.js';

// GET /health (public) -> 200 with db: "connected", or 503 if the database cannot be reached.
// The reason goes to our log only (never into the response, never the connection string).
export const getHealth = asyncHandler(async (req, res) => {
  try {
    await pingDatabase();
  } catch (err) {
    console.error(`Health check: the database is not reachable (${err.message})`);
    return fail(res, 503, 'SERVER_ERROR', 'Database is not reachable');
  }
  ok(res, { status: 'ok', db: 'connected', uptimeSeconds: Math.round(process.uptime()) });
});
