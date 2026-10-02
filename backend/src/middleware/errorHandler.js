// The ONE place where every error becomes a JSON response.
// Express knows this is an error handler because it has 4 parameters (don't remove `next`).

import multer from 'multer';
import { isProduction } from '../config/env.js';
import { fail } from '../utils/response.js';

export function errorHandler(err, req, res, next) {
  // 1. Errors we threw on purpose with `new AppError(...)`
  if (err.statusCode && err.code) {
    return fail(res, err.statusCode, err.code, err.message, err.fields);
  }

  // 2. Broken JSON in the request body
  if (err.type === 'entity.parse.failed') {
    return fail(res, 400, 'VALIDATION_ERROR', 'Request body is not valid JSON');
  }
  if (err.type === 'entity.too.large') {
    return fail(res, 400, 'VALIDATION_ERROR', 'Request body is too large');
  }

  // 3. Photo upload problems (file too big, etc.)
  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE' ? 'Photo must be 2 MB or smaller' : 'Invalid photo upload';
    return fail(res, 400, 'VALIDATION_ERROR', message, { photo: message });
  }

  // 4. A few known PostgreSQL errors -> friendly 4xx instead of a 500
  if (err.code === '23505') return fail(res, 409, 'CONFLICT', 'That record already exists');
  if (err.code === '23503') {
    // Foreign key violation: we tried to point at a row that does not exist.
    // If it is a user column, the token is valid but the user is gone (e.g. the database was reset):
    // 401 makes the frontend log out. Otherwise the issue does not exist (or was deleted a moment ago).
    const userColumns = ['user_id', 'created_by', 'changed_by'];
    if (userColumns.some((column) => err.constraint?.includes(column))) {
      return fail(res, 401, 'UNAUTHORIZED', 'Your account no longer exists. Please sign up or log in again');
    }
    return fail(res, 404, 'NOT_FOUND', 'Issue not found');
  }
  if (['23514', '22P02', '22003'].includes(err.code)) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Invalid value in request');
  }

  // 5. Anything else is our bug: log it, but don't leak details to the client
  console.error(err);
  const message = isProduction ? 'Something went wrong' : err.message || 'Something went wrong';
  return fail(res, 500, 'SERVER_ERROR', message);
}
