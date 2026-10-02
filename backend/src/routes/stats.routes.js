// /stats  (admin only)

import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { getStats } from '../controllers/stats.controller.js';

const router = Router();

router.get('/', requireAuth, requireRole('admin', 'Only admins can view stats'), getStats); // #12

export default router;
