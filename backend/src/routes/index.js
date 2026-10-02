// Connects every route file to its URL prefix, plus the public health check.

import { Router } from 'express';
import { ok } from '../utils/response.js';
import authRoutes from './auth.routes.js';
import issuesRoutes from './issues.routes.js';
import myRoutes from './my.routes.js';
import statsRoutes from './stats.routes.js';

const router = Router();

// Used by Render and by us to check that the server is alive (no login, no database)
router.get('/health', (req, res) => {
  ok(res, { status: 'ok', uptimeSeconds: Math.round(process.uptime()) });
});

router.use('/auth', authRoutes);
router.use('/issues', issuesRoutes);
router.use('/my', myRoutes);
router.use('/stats', statsRoutes);

export default router;
