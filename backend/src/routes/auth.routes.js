// /auth/*  (public endpoints, no token needed)

import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { loginLimiter, signupLimiter } from '../middleware/rateLimit.js';
import { signupSchema, loginSchema } from '../validators/auth.schema.js';
import { signup, login } from '../controllers/auth.controller.js';

const router = Router();

router.post('/signup', signupLimiter, validate(signupSchema), signup); // #1
router.post('/login', loginLimiter, validate(loginSchema), login); // #2

export default router;
