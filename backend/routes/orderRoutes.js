const express = require('express');
const { addOrderItems, getOrderById, getMyOrders, updateOrderToDelivered } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

module.exports = router;
