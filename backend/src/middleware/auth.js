// JWT helpers + the requireAuth middleware.
// The token payload is { id, role }. requireAuth puts the same thing on req.user.

import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const ALGORITHM = 'HS256';

// Create a token for a user. Used by signup and login.
// The token expires after JWT_EXPIRES_IN (e.g. "7d"); the frontend reads the `exp` claim.
export function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, env.jwtSecret, {
    algorithm: ALGORITHM,
    expiresIn: env.jwtExpiresIn,
  });
}

// Expects the header:  Authorization: Bearer <token>
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(AppError.unauthorized('Please log in to continue'));
  }

  try {
    // Only accept the algorithm we sign with (blocks "alg: none" and similar tricks)
    const payload = jwt.verify(token, env.jwtSecret, { algorithms: [ALGORITHM] });
    if (!payload.id || !payload.role) throw new Error('Token payload is incomplete');
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError'
        ? 'Your session has expired. Please log in again'
        : 'Invalid token. Please log in again';
    next(AppError.unauthorized(message));
  }
}
