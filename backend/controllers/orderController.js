import asyncHandler from '../utils/asyncHandler.js';
import Order from '../models/Order.js';

const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, totalPrice, paymentMethod } = req.body;
  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  }
  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    totalPrice,
    paymentMethod: paymentMethod || 'Cash On Delivery'
  });
  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (order) res.json(order);
  else res.status(404).json({ message: 'Order not found' });
});

const getMyOrders = asyncHandler(async (req, res) => {
  let orders;
  if (req.user && req.user.isAdmin) {
    orders = await Order.find({}).populate('user', 'name email');
  } else {
    orders = await Order.find({ user: req.user._id });
  }
  res.json(orders);
});

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

export { addOrderItems, getOrderById, getMyOrders, updateOrderToDelivered };
