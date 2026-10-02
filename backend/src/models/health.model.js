// The one query used to check that the database is reachable (GET /health and server start-up).

import { query } from '../config/db.js';

// Finishes normally if the database answers, throws if it does not.
export async function pingDatabase() {
  await query('SELECT 1');
}
