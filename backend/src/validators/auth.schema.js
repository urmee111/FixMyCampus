// Validation for POST /auth/signup and POST /auth/login (plan Sections 6.3 and 7 "Auth").
// Messages are written for the end user because the frontend shows them under each input.

import { z } from 'zod';
import { ROLES } from '../utils/constants.js';

// trim + lowercase, so "Rahim@Uni.edu " and "rahim@uni.edu" are the same account
const email = z
  .string({ error: 'Email is required' })
  .trim()
  .toLowerCase()
  .min(1, 'Email is required')
  .max(120, 'Email must be at most 120 characters')
  .email('Enter a valid email address');

export const signupSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .trim()
    .min(1, 'Name is required')
    .max(80, 'Name must be at most 80 characters'),
  email,
  password: z
    .string({ error: 'Password is required' })
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(72, 'Password must be at most 72 characters'), // bcrypt only reads 72 bytes
  role: z.enum(ROLES, { error: 'Role must be student or admin' }).default('student'),
  // Only checked when role is "admin"; the controller compares it to ADMIN_SIGNUP_CODE (403 if wrong)
  adminCode: z.string().optional(),
});

export const loginSchema = z.object({
  email,
  // On login we only check it is present (the real check is bcrypt compare)
  password: z.string({ error: 'Password is required' }).min(1, 'Password is required'),
});
