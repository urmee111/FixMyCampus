// Reads the .env file once and exports the settings as a plain object.
// Every other file imports `env` from here instead of touching process.env.

import dotenv from 'dotenv';

dotenv.config(); // loads backend/.env (run commands from the backend/ folder)

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000, // Render tells us which port to use through PORT
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  adminSignupCode: process.env.ADMIN_SIGNUP_CODE,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
  supabaseBucket: process.env.SUPABASE_BUCKET || 'issue-photos',
  // One address, or several separated by commas. Each one is trimmed and loses its trailing slash,
  // so it matches the browser's Origin header exactly (https://my-app.vercel.app, never .../)
  frontendUrls: (process.env.FRONTEND_URL || '')
    .split(',')
    .map((url) => url.trim().replace(/\/+$/, ''))
    .filter(Boolean),
  enableAssistant: process.env.ENABLE_ASSISTANT === 'true',
};

export const isProduction = env.nodeEnv === 'production';

// Browser addresses that CORS lets call the API (used in app.js): the frontend(s),
// plus the local Vite dev server when we are not in production.
export const allowedOrigins = isProduction ? env.frontendUrls : [...env.frontendUrls, 'http://localhost:5173'];

// Called once at startup. Warns if something important is missing.
// In production a missing secret is fatal (better to fail fast than run insecurely).
export function checkEnv() {
  if (isProduction && env.frontendUrls.length === 0) {
    console.warn('⚠️  FRONTEND_URL is not set, so no website is allowed to call this API (CORS)');
  }

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
