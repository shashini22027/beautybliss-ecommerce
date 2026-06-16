import asyncHandler from '../utils/asyncHandler.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, totalPrice, paymentMethod, customer, isPaid, paidAt, paymentResult } = req.body;
  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  }

  // Deduct inventory
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.countInStock = Math.max(0, product.countInStock - item.qty);
      if (product.variants && product.variants.length > 0) {
        // Find matching variant based on name
        const variant = product.variants.find(v => item.name.endsWith(`- ${v.name}`));
        if (variant) {
          variant.countInStock = Math.max(0, variant.countInStock - item.qty);
        }
      }
      await product.save();
    }
  }

  const order = new Order({
    user: req.user ? req.user._id : undefined,
    customer,
    orderItems,
    shippingAddress,
    totalPrice,
    paymentMethod: paymentMethod || 'Cash On Delivery',
    isPaid: isPaid || false,
    paidAt,
    paymentResult
  });
  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

const getOrderById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Order not found' });
  }
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (order) res.json(order);
  else res.status(404).json({ message: 'Order not found' });
});

const getMyOrders = asyncHandler(async (req, res) => {
  let orders;
  if (req.user && req.user.isAdmin) {
    orders = await Order.find({}).populate('user', 'name email');
  } else {
    orders = await Order.find({
      $or: [
        { user: req.user._id },
        { 'shippingAddress.email': req.user.email }
      ]
    });
  }
  res.json(orders);
});

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Invalid order id' });
    return;
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    {
      isDelivered: true,
      deliveredAt: Date.now(),
    },
    { new: true, runValidators: false }
  ).populate('user', 'name email');

  if (updatedOrder) {
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

const deleteOrder = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Invalid order id' });
    return;
  }

  const order = await Order.findById(req.params.id);

  if (order) {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order removed successfully' });
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

export { addOrderItems, getOrderById, getMyOrders, updateOrderToDelivered, deleteOrder };
