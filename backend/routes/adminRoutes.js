import express from 'express';
import { getDashboardStats, getAdminAuditLogs } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/stats', protect, admin, getDashboardStats);
router.get('/audit-logs', protect, admin, getAdminAuditLogs);

export default router;
