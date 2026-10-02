// Wraps an async controller so any thrown error / rejected promise goes to errorHandler.
// Without this, a failed DB query inside an async function would hang the request.

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
