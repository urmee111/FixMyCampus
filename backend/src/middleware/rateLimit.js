// Blocks password guessing: max 10 login attempts per IP every 15 minutes.
// Only FAILED attempts count (skipSuccessfulRequests), so a team logging in
// repeatedly during the demo is never locked out.

import rateLimit from 'express-rate-limit';
import { fail } from '../utils/response.js';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true, // sends RateLimit-* headers
  legacyHeaders: false,
  handler: (req, res) =>
    fail(res, 429, 'RATE_LIMITED', 'Too many login attempts. Please try again in 15 minutes'),
});
