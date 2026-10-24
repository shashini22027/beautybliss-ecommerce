import express from 'express';
import {
  getOrderById,
  getGuestOrderById,
  getOrderByNumber,
  getMyOrders,
  updateOrderToDelivered,
  deleteOrder
} from '../controllers/orderController.js';
import { createCheckoutOrder } from '../controllers/paymentController.js';
import { protect, optionalProtect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').post(optionalProtect, createCheckoutOrder).get(protect, getMyOrders);
router.post('/checkout', optionalProtect, createCheckoutOrder);
router.route('/myorders').get(protect, getMyOrders);
router.get('/lookup/:id', getGuestOrderById);
router.get('/track/:orderNo', getOrderByNumber);
router.route('/:id').get(protect, getOrderById).delete(protect, admin, deleteOrder);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

export default router;
