// Controllers receive the request, call the models, and send the response with ok() / fail().
// They are STUBS for now: every one returns 501 until Member A implements it.

import { asyncHandler } from '../utils/asyncHandler.js';
import { fail } from '../utils/response.js';

// POST /auth/signup  (public)  -> 201 { token, user }
export const signup = asyncHandler(async (req, res) => {
  // TODO: read req.validated.body; if role is 'admin' and adminCode !== env.adminSignupCode -> 403
  // TODO: email already exists -> 409 "An account with this email already exists"
  // TODO: hash the password with bcryptjs, save the user, return signToken(user) + user (no password_hash)
  fail(res, 501, 'NOT_IMPLEMENTED', 'TODO');
});

// POST /auth/login  (public, loginLimiter)  -> 200 { token, user }
export const login = asyncHandler(async (req, res) => {
  // TODO: find user by email; compare password with bcryptjs
  // TODO: unknown email OR wrong password -> the SAME 401 "Invalid email or password"
  fail(res, 501, 'NOT_IMPLEMENTED', 'TODO');
});
