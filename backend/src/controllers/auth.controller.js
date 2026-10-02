// Auth endpoints (plan Section 6.2, #1 and #2).
// Controllers receive the request, call the models, and send the response with ok() / AppError.
// Input is already validated by the zod schemas, so read it from req.validated.body.

import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { signToken } from '../middleware/auth.js';
import * as userModel from '../models/user.model.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/response.js';

const SALT_ROUNDS = 10; // how much work bcrypt does per password (higher = slower to crack, and slower to log in)

// A real bcrypt hash of a throwaway password. Login compares against it when the email does not
// exist, so "unknown email" takes as long as "wrong password" and timing does not leak which emails exist.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', SALT_ROUNDS);

// The only user fields we ever send to the client (never password_hash)
const toPublicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// POST /auth/signup  (public)  ->  201 { token, user }
export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role, adminCode } = req.validated.body;

  // Without this check any student could make themselves an admin.
  // If ADMIN_SIGNUP_CODE is not set on the server, nobody can sign up as admin.
  if (role === 'admin' && (!env.adminSignupCode || adminCode !== env.adminSignupCode)) {
    const message = adminCode ? 'Invalid admin code' : 'Admin code is required to sign up as admin';
    throw new AppError(403, 'FORBIDDEN', message, { adminCode: message });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  let user;
  try {
    user = await userModel.createUser({ name, email, passwordHash, role });
  } catch (err) {
    // 23505 = Postgres "unique violation": the email already exists.
    // Catching it here (instead of checking first) is safe even if two signups arrive at the same moment.
    if (err.code === '23505') {
      const message = 'An account with this email already exists';
      throw new AppError(409, 'CONFLICT', message, { email: message });
    }
    throw err;
  }

  ok(res, { token: signToken(user), user: toPublicUser(user) }, 201);
});

// POST /auth/login  (public, loginLimiter)  ->  200 { token, user }
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;

  const user = await userModel.findByEmail(email);

  // Always run the password check, even for an unknown email (see DUMMY_HASH above)
  const passwordMatches = await bcrypt.compare(password, user ? user.password_hash : DUMMY_HASH);

  // Unknown email and wrong password give the SAME answer, so attackers cannot find out which emails are registered
  if (!user || !passwordMatches) {
    throw new AppError(401, 'UNAUTHORIZED', 'Invalid email or password');
  }

  ok(res, { token: signToken(user), user: toPublicUser(user) });
});
