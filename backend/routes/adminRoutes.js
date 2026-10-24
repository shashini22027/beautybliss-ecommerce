import express from 'express';
import { getDashboardStats, getAdminAuditLogs } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { adjustInventory, getInventory, updateLowStockThreshold } from '../controllers/inventoryController.js';
const router = express.Router();

router.get('/stats', protect, admin, getDashboardStats);
router.get('/audit-logs', protect, admin, getAdminAuditLogs);
router.get('/inventory', protect, admin, getInventory);
router.post('/inventory/adjust', protect, admin, adjustInventory);
router.patch('/inventory/:productId/threshold', protect, admin, updateLowStockThreshold);

export default router;
