import express from 'express';
import {
  addOrderItems,
  getOrderById,
  getGuestOrderById,
  getOrderByNumber,
  getOrdersByEmail,
  getMyOrders,
  updateOrderToDelivered,
  deleteOrder
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').post(addOrderItems).get(protect, getMyOrders);
router.route('/myorders').get(protect, getMyOrders);
router.get('/lookup', getOrdersByEmail);
router.get('/lookup/:id', getGuestOrderById);
router.get('/track/:orderNo', getOrderByNumber);
router.route('/:id').get(protect, getOrderById).delete(protect, admin, deleteOrder);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

export default router;
