// Rate limiters: they count requests per client IP and answer 429 RATE_LIMITED when it is too many.
// (They need `app.set('trust proxy', 1)` in app.js, otherwise behind Render everyone looks like one IP.)

import rateLimit from 'express-rate-limit';
import { fail } from '../utils/response.js';

const FIFTEEN_MINUTES = 15 * 60 * 1000;

// Same 429 response shape for every limiter (plan Section 6.1)
const tooManyRequests = (message) => (req, res) => fail(res, 429, 'RATE_LIMITED', message);

// Blocks password guessing: max 10 login attempts per IP every 15 minutes.
// Only FAILED attempts count (skipSuccessfulRequests), so a team logging in
// repeatedly during the demo is never locked out.
export const loginLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true, // sends RateLimit-* headers
  legacyHeaders: false,
  handler: tooManyRequests('Too many login attempts. Please try again in 15 minutes'),
});

// Blocks mass account creation and guessing of the admin signup code:
// max 20 signup requests per IP every 15 minutes. Every request counts (successful or not).
export const signupLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: tooManyRequests('Too many signup attempts. Please try again in 15 minutes'),
});
