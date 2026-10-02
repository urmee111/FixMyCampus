// Runs when no route matched the request -> 404 in our standard error shape.

import { AppError } from '../utils/AppError.js';

export function notFound(req, res, next) {
  next(AppError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}
