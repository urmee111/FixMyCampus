// /my/*  (data about the logged-in user)

import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getMyIssues } from '../controllers/my.controller.js';

const router = Router();

router.get('/issues', requireAuth, getMyIssues); // #11  ->  GET /my/issues

export default router;
