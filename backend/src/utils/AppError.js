// An error we throw on purpose (wrong input, not logged in, not found...).
// errorHandler.js turns it into the standard JSON error response (plan Section 6.1).
//
// Usage:  throw new AppError(404, 'NOT_FOUND', 'Issue not found');
//     or: throw AppError.notFound('Issue not found');

export class AppError extends Error {
  constructor(statusCode, code, message, fields) {
    super(message);
    this.statusCode = statusCode; // HTTP status, e.g. 404
    this.code = code; // machine-readable code, e.g. 'NOT_FOUND'
    this.fields = fields; // optional { fieldName: 'message' } for validation errors
  }

  static validation(message, fields) {
    return new AppError(400, 'VALIDATION_ERROR', message, fields);
  }

  static unauthorized(message = 'Please log in to continue') {
    return new AppError(401, 'UNAUTHORIZED', message);
  }

  static forbidden(message = 'You are not allowed to do this') {
    return new AppError(403, 'FORBIDDEN', message);
  }

  static notFound(message = 'Not found') {
    return new AppError(404, 'NOT_FOUND', message);
  }

  static conflict(message) {
    return new AppError(409, 'CONFLICT', message);
  }
}
