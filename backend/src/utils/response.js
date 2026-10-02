// The ONE response shape used everywhere (plan Section 6.1).
//   Success: { "success": true,  "data": { ... } }
//   Error:   { "success": false, "error": { "code", "message", "fields"? } }

// Send a success response. Default status is 200 (use 201 for "created").
export function ok(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

// Send an error response. `fields` is optional: { fieldName: 'message' }.
export function fail(res, status, code, message, fields) {
  const error = { code, message };
  if (fields) error.fields = fields;
  return res.status(status).json({ success: false, error });
}
