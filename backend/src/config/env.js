// Reads the .env file once and exports the settings as a plain object.
// Every other file imports `env` from here instead of touching process.env.

import dotenv from 'dotenv';

dotenv.config(); // loads backend/.env (run commands from the backend/ folder)

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  adminSignupCode: process.env.ADMIN_SIGNUP_CODE,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
  supabaseBucket: process.env.SUPABASE_BUCKET || 'issue-photos',
  // Remove any trailing slash so it matches the browser's Origin header exactly
  frontendUrl: (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, ''),
  enableAssistant: process.env.ENABLE_ASSISTANT === 'true',
};

export const isProduction = env.nodeEnv === 'production';

// Called once at startup. Warns if something important is missing.
// In production a missing secret is fatal (better to fail fast than run insecurely).
export function checkEnv() {
  const required = [
    ['DATABASE_URL', env.databaseUrl],
    ['JWT_SECRET', env.jwtSecret],
  ];
  const missing = required.filter(([, value]) => !value).map(([name]) => name);

  if (missing.length === 0) return;

  const message = `Missing environment variables: ${missing.join(', ')} (copy .env.example to .env)`;
  if (isProduction) throw new Error(message);
  console.warn(`⚠️  ${message}`);
}
