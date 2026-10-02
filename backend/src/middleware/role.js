// Role check. Always put it AFTER requireAuth (it needs req.user).
//
// Usage:  router.patch('/:id/status', requireAuth, requireRole('admin', 'Only admins can change status'), ...)
// The API check is the real security; hiding buttons in the UI is only for looks.

import { AppError } from '../utils/AppError.js';

export function requireRole(role, message) {
  return (req, res, next) => {
    if (!req.user) return next(AppError.unauthorized());

    if (req.user.role !== role) {
      return next(AppError.forbidden(message || `Only ${role}s can do this`));
    }
    next();
  };
}
