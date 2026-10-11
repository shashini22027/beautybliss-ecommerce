import asyncHandler from '../utils/asyncHandler.js';
import Order from '../models/Order.js';
import OrderSequence from '../models/OrderSequence.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

const ORDER_NUMBER_SEQUENCE_ID = 'order-number';
const FIRST_ORDER_NUMBER = 52;

const ensureOrderNumbers = async () => {
  const existingOrders = await Order.find({ orderNo: /^C\d+$/ })
    .select('orderNo')
    .lean();
  const highestExistingNumber = existingOrders.reduce((highest, order) => {
    const number = Number(order.orderNo.slice(1));
    return Number.isFinite(number) ? Math.max(highest, number) : highest;
  }, FIRST_ORDER_NUMBER - 1);

  try {
    await OrderSequence.updateOne(
      { _id: ORDER_NUMBER_SEQUENCE_ID },
      { $max: { value: highestExistingNumber } },
      { upsert: true }
    );
  } catch (error) {
    if (error.code !== 11000) throw error;
    await OrderSequence.updateOne(
      { _id: ORDER_NUMBER_SEQUENCE_ID },
      { $max: { value: highestExistingNumber } }
    );
  }

  const ordersWithoutNumber = await Order.find({
    $or: [{ orderNo: { $exists: false } }, { orderNo: null }, { orderNo: '' }],
  })
    .sort({ createdAt: 1, _id: 1 })
    .select('_id')
    .lean();

  for (const order of ordersWithoutNumber) {
    const sequence = await OrderSequence.findOneAndUpdate(
      { _id: ORDER_NUMBER_SEQUENCE_ID },
      { $inc: { value: 1 } },
      { new: true }
    );
    await Order.updateOne(
      { _id: order._id, $or: [{ orderNo: { $exists: false } }, { orderNo: null }, { orderNo: '' }] },
      { $set: { orderNo: `C${String(sequence.value).padStart(4, '0')}` } }
    );
  }
};

const getNextOrderNumber = async () => {
  await ensureOrderNumbers();
  const sequence = await OrderSequence.findOneAndUpdate(
    { _id: ORDER_NUMBER_SEQUENCE_ID },
    { $inc: { value: 1 } },
    { new: true }
  );
  return `C${String(sequence.value).padStart(4, '0')}`;
};

const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, totalPrice, paymentMethod, customer, isPaid, paidAt, paymentResult } = req.body;
  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  }

  const orderNo = await getNextOrderNumber();

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
    orderNo,
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
  await ensureOrderNumbers();
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Order not found' });
  }
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const userEmail = String(req.user.email || '').trim().toLowerCase();
  const orderEmails = [
    order.customer?.email,
    order.shippingAddress?.email,
    order.paymentResult?.email_address,
  ].map((email) => String(email || '').trim().toLowerCase());
  if (!req.user.isAdmin && !orderEmails.includes(userEmail)) {
    return res.status(404).json({ message: 'Order not found' });
  }

  return res.json(order);
});

const getOrdersByEmail = asyncHandler(async (req, res) => {
  await ensureOrderNumbers();
  const email = String(req.query.email || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Enter a valid email address' });
  }

  const emailRegex = new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
  const orders = await Order.find({
    $or: [
      { 'customer.email': emailRegex },
      { 'shippingAddress.email': emailRegex },
      { 'paymentResult.email_address': emailRegex },
    ],
  }).sort({ createdAt: -1 });

  res.json(orders);
});

const getGuestOrderById = asyncHandler(async (req, res) => {
  await ensureOrderNumbers();
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const email = String(req.query.email || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Enter a valid email address' });
  }

  const emailRegex = new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
  const order = await Order.findOne({
    _id: req.params.id,
    $or: [
      { 'customer.email': emailRegex },
      { 'shippingAddress.email': emailRegex },
      { 'paymentResult.email_address': emailRegex },
    ],
  });

  if (order) return res.json(order);
  return res.status(404).json({ message: 'Order not found' });
});

const getMyOrders = asyncHandler(async (req, res) => {
  await ensureOrderNumbers();
  let orders;
  if (req.user && req.user.isAdmin) {
    orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
  } else {
    const email = String(req.user.email || '').trim();
    const emailRegex = new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    orders = await Order.find({
      $or: [
        { 'customer.email': emailRegex },
        { 'shippingAddress.email': emailRegex },
        { 'paymentResult.email_address': emailRegex },
      ]
    }).sort({ createdAt: -1 });
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

export {
  addOrderItems,
  getOrderById,
  getGuestOrderById,
  getOrdersByEmail,
  getMyOrders,
  updateOrderToDelivered,
  deleteOrder,
};
