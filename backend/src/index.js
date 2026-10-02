// Entry point: load settings, start the server, and check the database connection.
// Run with `npm run dev` (auto-restart) or `npm start`.

import { env, checkEnv } from './config/env.js';
import { pingDatabase } from './models/health.model.js';
import app from './app.js';

checkEnv();

// Express 5 gives startup errors (like "port already in use") to this callback, so we must check for them,
// otherwise the message below would be printed even though the server never started.
app.listen(env.port, (err) => {
  if (err) {
    console.error(`❌ Could not start the server on port ${env.port}: ${err.message}`);
    console.error('   Is another copy of the backend already running? Stop it or change PORT in .env');
    process.exit(1);
  }
  console.log(`🚀 API running on http://localhost:${env.port} in ${env.nodeEnv} mode  (try /health)`);
});

// Just a friendly check. A failure only prints a warning (never the DATABASE_URL), so the server still
// starts and /health can report the problem. (An unusable DATABASE_URL, e.g. a password with a "#" that
// is not URL-encoded, also ends up here instead of crashing the start-up.)
pingDatabase()
  .then(() => console.log('✅ Database connected'))
  .catch((err) => console.warn(`⚠️  Could not connect to the database: ${err.message}  (check DATABASE_URL)`));
