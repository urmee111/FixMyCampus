// Entry point: load settings, start the server, and check the database connection.
// Run with `npm run dev` (auto-restart) or `npm start`.

import { env, checkEnv } from './config/env.js';
import { pool } from './config/db.js';
import app from './app.js';

checkEnv();

app.listen(env.port, () => {
  console.log(`🚀 API running on http://localhost:${env.port}  (try /health)`);
});

// Just a friendly check. A failure only prints a warning, so /health still works without a database.
pool
  .query('SELECT 1')
  .then(() => console.log('✅ Database connected'))
  .catch((err) => console.warn(`⚠️  Could not connect to the database: ${err.message}`));
