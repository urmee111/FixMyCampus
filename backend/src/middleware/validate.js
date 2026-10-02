// Checks request data against a zod schema.
//   validate(schema)           -> checks req.body   (default)
//   validate(schema, 'query')  -> checks req.query
//   validate(schema, 'params') -> checks req.params
//
// On failure: 400 VALIDATION_ERROR with one message per field (plan Section 6.1).
// On success: the CLEAN data (trimmed, converted, unknown keys removed) is saved in
//   req.validated.body / req.validated.query / req.validated.params
// Controllers must read from req.validated, not from req.body directly.
// (We don't overwrite req.query because Express 5 makes it read-only.)

import { AppError } from '../utils/AppError.js';

export function validate(schema, source = 'body') {
  return (req, res, next) => {
    // req.body is undefined when no body was sent, so fall back to {}
    const input = source === 'body' ? (req.body ?? {}) : req[source];
    const result = schema.safeParse(input);

    if (!result.success) {
      const fields = {};
      for (const issue of result.error.issues) {
        const name = issue.path.join('.') || source;
        if (!fields[name]) fields[name] = issue.message; // keep the first message per field
      }
      // The top-level message is the first field message, e.g. "Title is required"
      const message = Object.values(fields)[0];
      return next(AppError.validation(message, fields));
    }

    req.validated = { ...req.validated, [source]: result.data };
    next();
  };
}
