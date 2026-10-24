import Stripe from "stripe";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import OrderSequence from "../models/OrderSequence.js";
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

// @desc    Create a Stripe PaymentIntent
// @route   POST /api/payment/create-payment-intent
// @access  Public
export const createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order || order.paymentMethod !== 'card' || order.isPaid) {
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
    if (checkoutKey) {
      const existingOrder = await Order.findOne({ checkoutKey });
      if (existingOrder) return res.status(200).json(existingOrder);
    }
    if (!Array.isArray(orderItems) || orderItems.length === 0) return res.status(400).json({ message: 'Add at least one item to your order.' });
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
      if (item.variantId && product.variants?.length) variant = product.variants.id(item.variantId);
      if (!variant && item.color && product.variants?.length) variant = product.variants.find((entry) => entry.name === item.color);
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
      for (const item of verifiedItems) {
        const result = item.variantId
          ? await Product.updateOne({ _id: item.product, variants: { $elemMatch: { _id: item.variantId, countInStock: { $gte: item.qty } } } }, { $inc: { 'variants.$.countInStock': -item.qty, countInStock: -item.qty } })
          : await Product.updateOne({ _id: item.product, countInStock: { $gte: item.qty } }, { $inc: { countInStock: -item.qty } });
        if (!result.modifiedCount) {
          await Order.deleteOne({ _id: order._id });
          return res.status(409).json({ message: `${item.name} stock changed before order placement. Refresh your cart and try again.` });
        }
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
    const order = await Order.findById(orderId);
    if (!order || order.paymentMethod !== 'card') return res.status(404).json({ message: 'Order not found.' });
    if (!paymentIntentId || typeof paymentIntentId !== 'string') return res.status(400).json({ message: 'Payment reference is missing.' });
    const stripe = getStripe();
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.metadata?.orderId !== String(order._id) || intent.amount !== Math.round(Number(order.totalPrice) * 100) || intent.currency !== 'lkr') {
      return res.status(400).json({ message: 'Payment details do not match the order.' });
    }
    if (intent.status !== 'succeeded') return res.status(409).json({ message: 'Payment has not succeeded.', status: intent.status });
    if (order.isPaid) return res.json(order);
    order.isPaid = true;
    order.paidAt = new Date(intent.created * 1000);
    order.paymentResult = { ...(order.paymentResult?.toObject?.() || order.paymentResult || {}), id: intent.id, status: intent.status };
    await order.save();
    for (const item of order.orderItems) {
      const stockUpdate = item.variantId
        ? await Product.updateOne({ _id: item.product, variants: { $elemMatch: { _id: item.variantId, countInStock: { $gte: item.qty } } } }, { $inc: { 'variants.$.countInStock': -item.qty, countInStock: -item.qty } })
        : await Product.updateOne({ _id: item.product, countInStock: { $gte: item.qty } }, { $inc: { countInStock: -item.qty } });
      if (!stockUpdate.modifiedCount) {
        console.error(`Paid order ${order.orderNo} could not reserve stock for ${item.product}`);
      }
    }
    try {
      await sendEmail({ to: order.customer.email, subject: `BeautyBliss order ${order.orderNo} confirmed`, html: `<p>Thank you, ${order.customer.name}. Your payment is confirmed for order <strong>${order.orderNo}</strong>.</p><p>Total: ${order.totalPrice}</p><p>You can track your order from the Track Order page.</p>` });
    } catch (emailError) { console.error('Order confirmation email failed:', emailError.message); }
    return res.json(order);
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
