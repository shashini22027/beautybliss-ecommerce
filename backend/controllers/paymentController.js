import Stripe from "stripe";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import OrderSequence from "../models/OrderSequence.js";
import StockMovement from "../models/StockMovement.js";
import { clearCache } from "../middleware/cacheMiddleware.js";
import sendEmail from "../utils/sendEmail.js";
import mongoose from "mongoose";

const getNextOrderNo = async () => {
  const existingOrders = await Order.find({ orderNo: /^C\d+$/ }).select('orderNo').lean();
  const highest = existingOrders.reduce((max, order) => Math.max(max, Number(String(order.orderNo).slice(1)) || 0), 51);
  try {
    await OrderSequence.updateOne({ _id: 'order-number' }, { $max: { value: highest } }, { upsert: true });
  } catch (error) {
    if (error.code !== 11000) throw error;
    await OrderSequence.updateOne({ _id: 'order-number' }, { $max: { value: highest } });
  }
  const sequence = await OrderSequence.findOneAndUpdate({ _id: 'order-number' }, { $inc: { value: 1 } }, { new: true });
  return `C${String(sequence.value).padStart(4, '0')}`;
};

let stripeInstance = null;

const getStripe = () => {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeInstance;
};

const canAccessOrder = (req, order, checkoutKey) => {
  const isOrderOwner = req.user && order.user && String(req.user._id) === String(order.user);
  const hasGuestCheckoutKey = typeof checkoutKey === 'string'
    && typeof order.checkoutKey === 'string'
    && checkoutKey.length >= 32
    && checkoutKey === order.checkoutKey;
  return Boolean(isOrderOwner || hasGuestCheckoutKey);
};

const adjustProductStock = (item, amount) => item.variantId
  ? Product.updateOne(
      { _id: item.product, variants: { $elemMatch: { _id: item.variantId, ...(amount < 0 ? { countInStock: { $gte: -amount } } : {}) } } },
      { $inc: { 'variants.$.countInStock': amount, countInStock: amount } }
    )
  : Product.updateOne(
      { _id: item.product, ...(amount < 0 ? { countInStock: { $gte: -amount } } : {}) },
      { $inc: { countInStock: amount } }
    );

const reserveStock = async (items, order) => {
  const reserved = [];
  try {
    for (const item of items) {
      const result = await adjustProductStock(item, -item.qty);
      if (!result.modifiedCount) {
        await Promise.allSettled(reserved.map((reservedItem) => adjustProductStock(reservedItem, reservedItem.qty)));
        return item;
      }
      reserved.push(item);
    }
    try {
      await StockMovement.insertMany(items.map((item) => ({
        product: item.product,
        productName: item.name,
        variantId: item.variantId || null,
        variantName: item.color || '',
        type: 'order',
        quantityChange: -item.qty,
        reason: `Stock reserved for order ${order.orderNo || order._id}`,
        order: order._id,
      })));
    } catch (movementError) {
      await StockMovement.deleteMany({ order: order._id, type: 'order' }).catch(() => {});
      console.error(`Could not record stock movement for order ${order.orderNo || order._id}:`, movementError.message);
    }
    await clearCache('/api/products*');
    return null;
  } catch (error) {
    if (order?._id) await StockMovement.deleteMany({ order: order._id, type: 'order' }).catch(() => {});
    await Promise.allSettled(reserved.map((reservedItem) => adjustProductStock(reservedItem, reservedItem.qty)));
    throw error;
  }
};

// @desc    Create a Stripe PaymentIntent
// @route   POST /api/payment/create-payment-intent
// @access  Public
export const createPaymentIntent = async (req, res) => {
  try {
    const { orderId, checkoutKey } = req.body;
    const order = await Order.findById(orderId);
    if (!order || !canAccessOrder(req, order, checkoutKey)) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    if (order.paymentMethod !== 'card' || order.isPaid) {
      return res.status(400).json({ message: 'A pending card order is required.' });
    }
    if (!process.env.STRIPE_SECRET_KEY) return res.status(503).json({ message: 'Card payments are not configured.' });

    const stripe = getStripe();
    if (order.paymentResult?.id) {
      const existingIntent = await stripe.paymentIntents.retrieve(order.paymentResult.id);
      if (existingIntent.status !== 'canceled' && existingIntent.status !== 'succeeded') {
        return res.status(200).json({ clientSecret: existingIntent.client_secret, orderId: order._id });
      }
      if (existingIntent.status === 'succeeded') return res.status(409).json({ message: 'Payment has already been completed.' });
    }
    const intentAmount = Math.round(Number(order.totalPrice) * 100);
    if (!Number.isSafeInteger(intentAmount) || intentAmount <= 0) return res.status(400).json({ message: 'Invalid order total.' });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: intentAmount,
      currency: 'lkr',
      metadata: { orderId: String(order._id), orderNo: order.orderNo },
      automatic_payment_methods: {
        enabled: true,
      },
    }, { idempotencyKey: `beautybliss-order-${order._id}` });
    order.paymentResult = { id: paymentIntent.id, status: paymentIntent.status };
    await order.save();

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      orderId: order._id,
    });
  } catch (error) {
    console.error("Stripe PaymentIntent error:", error.message);
    res.status(500).json({ message: "Payment processing failed.", error: error.message });
  }
};

export const createCheckoutOrder = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) return res.status(503).json({ message: 'Checkout is temporarily unavailable. Please try again shortly.' });
    const { orderItems, customer, shippingAddress, paymentMethod = 'card', orderNotes = '', checkoutKey } = req.body;
    if (typeof checkoutKey !== 'string' || checkoutKey.length < 32 || checkoutKey.length > 128) {
      return res.status(400).json({ message: 'Refresh checkout and try again.' });
    }
    if (checkoutKey) {
      const existingOrder = await Order.findOne({ checkoutKey });
      if (existingOrder) return res.status(200).json(existingOrder);
    }
    if (!Array.isArray(orderItems) || orderItems.length === 0 || orderItems.length > 50) return res.status(400).json({ message: 'Add between 1 and 50 items to your order.' });
    if (!customer?.name || !customer?.email || !customer?.phone || !shippingAddress?.address || !shippingAddress?.city) {
      return res.status(400).json({ message: 'Complete your contact and delivery details.' });
    }
    const email = String(customer.email).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'Enter a valid email address.' });
    if (!['card', 'cod'].includes(paymentMethod)) return res.status(400).json({ message: 'Choose a supported payment method.' });

    const verifiedItems = [];
    for (const item of orderItems) {
      const productId = item.product || item._id;
      const quantity = Number(item.qty || item.quantity);
      if (!mongoose.Types.ObjectId.isValid(productId) || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) return res.status(400).json({ message: 'An order item or quantity is invalid.' });
      const product = await Product.findById(productId);
      if (!product) return res.status(400).json({ message: 'A product in your cart is no longer available.' });
      let variant = null;
      if (product.variants?.length) {
        if (item.variantId) variant = product.variants.id(item.variantId);
        if (!variant && item.color) variant = product.variants.find((entry) => entry.name === item.color);
        if (!variant) return res.status(400).json({ message: `Choose an available shade for ${product.name}.` });
      } else if (item.variantId || item.color) {
        return res.status(400).json({ message: `The selected shade for ${product.name} is no longer available.` });
      }
      const availableStock = variant ? variant.countInStock : product.countInStock;
      if (availableStock < quantity) return res.status(409).json({ message: `${product.name}${variant ? ` (${variant.name})` : ''} does not have enough stock.` });
      verifiedItems.push({ product: product._id, name: product.name, qty: quantity, image: variant?.image || product.image || product.images?.[0] || '', price: product.price, color: variant?.name || '', variantId: variant?._id });
    }
    const subtotal = verifiedItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shippingPrice = 0;
    const orderNo = await getNextOrderNo();
    const order = await Order.create({
      orderNo,
      checkoutKey,
      user: req.user?._id,
      customer: { ...customer, email },
      orderItems: verifiedItems,
      shippingAddress: { ...shippingAddress, email, country: 'Sri Lanka' },
      paymentMethod,
      isPaid: false,
      shippingPrice,
      taxPrice: 0,
      totalPrice: subtotal + shippingPrice,
      orderNotes,
    });
    if (paymentMethod === 'cod') {
      let unavailableItem;
      try {
        unavailableItem = await reserveStock(verifiedItems, order);
      } catch (stockError) {
        await Order.deleteOne({ _id: order._id });
        throw stockError;
      }
      if (unavailableItem) {
        await Order.deleteOne({ _id: order._id });
        return res.status(409).json({ message: `${unavailableItem.name} stock changed before order placement. Refresh your cart and try again.` });
      }
      try {
        await sendEmail({ to: email, subject: `BeautyBliss order ${order.orderNo} received`, html: `<p>Thank you, ${customer.name}. We received order <strong>${order.orderNo}</strong>.</p><p>Total: ${order.totalPrice}</p><p>You can track your order from the Track Order page.</p>` });
      } catch (emailError) { console.error('Order confirmation email failed:', emailError.message); }
    }
    return res.status(201).json(order);
  } catch (error) {
    console.error('Checkout order creation failed:', error);
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
    if (error.code === 11000) return res.status(409).json({ message: 'This checkout was already submitted. Reload your order or try again.' });
    return res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'We could not create your order. Please try again.' : `We could not create your order: ${error.message}` });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const orderId = req.body.orderId || req.query.orderId;
    const paymentIntentId = req.body.paymentIntentId || req.query.paymentIntentId;
    const checkoutKey = req.body.checkoutKey || req.query.checkoutKey;
    const order = await Order.findById(orderId);
    if (!order || !canAccessOrder(req, order, checkoutKey) || order.paymentMethod !== 'card') return res.status(404).json({ message: 'Order not found.' });
    if (!paymentIntentId || typeof paymentIntentId !== 'string') return res.status(400).json({ message: 'Payment reference is missing.' });
    const stripe = getStripe();
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.metadata?.orderId !== String(order._id) || intent.amount !== Math.round(Number(order.totalPrice) * 100) || intent.currency !== 'lkr') {
      return res.status(400).json({ message: 'Payment details do not match the order.' });
    }
    if (intent.status !== 'succeeded') return res.status(409).json({ message: 'Payment has not succeeded.', status: intent.status });
    if (order.isPaid) return res.json(order);

    const claimedOrder = await Order.findOneAndUpdate(
      { _id: order._id, isPaid: false, 'paymentResult.status': { $nin: ['verifying', 'succeeded', 'refunded', 'refund_pending'] } },
      { $set: { 'paymentResult.id': intent.id, 'paymentResult.status': 'verifying' } },
      { new: true }
    );
    if (!claimedOrder) {
      const latestOrder = await Order.findById(order._id);
      if (latestOrder?.isPaid) return res.json(latestOrder);
      if (latestOrder?.paymentResult?.status === 'refunded') {
        return res.status(409).json({ message: 'Inventory changed and a refund was initiated for this payment.' });
      }
      if (latestOrder?.paymentResult?.status === 'refund_pending') {
        return res.status(502).json({ message: 'A refund needs support review. Please contact customer support.' });
      }
      return res.status(409).json({ message: 'Payment verification is already in progress. Please retry shortly.' });
    }

    const unavailableItem = await reserveStock(claimedOrder.orderItems, claimedOrder);
    if (unavailableItem) {
      try {
        const refund = await stripe.refunds.create(
          { payment_intent: intent.id },
          { idempotencyKey: `beautybliss-stock-refund-${claimedOrder._id}` }
        );
        claimedOrder.paymentResult = {
          id: intent.id,
          status: 'refunded',
          refundId: refund.id,
          refundStatus: refund.status,
        };
        await claimedOrder.save();
        return res.status(409).json({ message: `${unavailableItem.name} became unavailable. A refund has been initiated.` });
      } catch (refundError) {
        claimedOrder.paymentResult.status = 'refund_pending';
        await claimedOrder.save();
        console.error('Refund after inventory conflict failed:', refundError.message);
        return res.status(502).json({ message: 'Payment completed, but inventory could not be reserved. Contact support to complete your refund.' });
      }
    }

    claimedOrder.isPaid = true;
    claimedOrder.paidAt = new Date(intent.created * 1000);
    claimedOrder.paymentResult = { id: intent.id, status: intent.status };
    await claimedOrder.save();
    try {
      await sendEmail({ to: claimedOrder.customer.email, subject: `BeautyBliss order ${claimedOrder.orderNo} confirmed`, html: `<p>Thank you, ${claimedOrder.customer.name}. Your payment is confirmed for order <strong>${claimedOrder.orderNo}</strong>.</p><p>Total: ${claimedOrder.totalPrice}</p><p>You can track your order from the Track Order page.</p>` });
    } catch (emailError) { console.error('Order confirmation email failed:', emailError.message); }
    return res.json(claimedOrder);
  } catch (error) {
    console.error('Stripe payment verification error:', error.message);
    return res.status(500).json({ message: 'Unable to verify payment right now.' });
  }
};

// @desc    Get Stripe publishable key
// @route   GET /api/payment/config
// @access  Public
export const getStripeConfig = (req, res) => {
  res.status(200).json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
};
