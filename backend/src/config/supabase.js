// Supabase client, used ONLY for photo storage (the database goes through pg).
// It uses the SERVICE key, which is secret: keep it on the backend, never in frontend code.
// It stays `null` until SUPABASE_URL and SUPABASE_SERVICE_KEY are set, so the server still starts.

import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

export const supabase =
  env.supabaseUrl && env.supabaseServiceKey
    ? createClient(env.supabaseUrl, env.supabaseServiceKey, {
        auth: { persistSession: false },
      })
    : null;

// Name of the public storage bucket that holds issue photos
export const photoBucket = env.supabaseBucket;
