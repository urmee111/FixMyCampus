// Connects every route file to its URL prefix, plus the public health check.

import { Router } from 'express';
import { getHealth } from '../controllers/health.controller.js';
import authRoutes from './auth.routes.js';
import issuesRoutes from './issues.routes.js';
import myRoutes from './my.routes.js';
import statsRoutes from './stats.routes.js';

const router = Router();

// Used by Render and by us to check that the server and the database are alive (no login needed)
router.get('/health', getHealth);

router.use('/auth', authRoutes);
router.use('/issues', issuesRoutes);
router.use('/my', myRoutes);
router.use('/stats', statsRoutes);

export default router;
