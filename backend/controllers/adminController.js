import asyncHandler from '../utils/asyncHandler.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import Message from '../models/Message.js';
import AdminAuditLog from '../models/AdminAuditLog.js';
import mongoose from 'mongoose';

const parseRange = (from, to) => {
  const isDateOnly = (value) => typeof value === 'string'
    && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`))
    && new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) === value;
  if ((from && !isDateOnly(from)) || (to && !isDateOnly(to))) return null;
  const end = to ? new Date(`${to}T23:59:59.999Z`) : new Date();
  const start = from
    ? new Date(`${from}T00:00:00.000Z`)
    : new Date(end.getTime() - 29 * 24 * 60 * 60 * 1000);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
    return null;
  }
  return { start, end };
};

const getDashboardStats = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Dashboard data is temporarily unavailable because the database is disconnected.' });
  }
  const range = parseRange(req.query.from, req.query.to);
  if (!range) return res.status(400).json({ message: 'Choose a valid date range.' });

  const paidRange = { isPaid: true, createdAt: { $gte: range.start, $lte: range.end } };
  const [
    totalOrders,
    totalProducts,
    totalCustomers,
    pendingOrders,
    paidOrders,
    deliveredRevenue,
    lowStockProducts,
    lowStockCount,
    pendingAppointments,
    unreadMessages,
    recentOrders,
    salesByDay,
    topProducts,
  ] = await Promise.all([
    Order.countDocuments({}),
    Product.countDocuments({}),
    User.countDocuments({ isAdmin: false }),
    Order.countDocuments({ isPaid: false }),
    Order.countDocuments(paidRange),
    Order.aggregate([
      { $match: { ...paidRange, isDelivered: true } },
      { $group: { _id: null, revenue: { $sum: '$totalPrice' } } },
    ]),
    Product.find({ countInStock: { $lte: 5 } })
      .select('name image countInStock price')
      .sort({ countInStock: 1, name: 1 })
      .limit(8)
      .lean(),
    Product.countDocuments({ countInStock: { $lte: 5 } }),
    Appointment.countDocuments({ status: 'pending' }),
    Message.countDocuments({ isRead: false }),
    Order.find({}).select('orderNo customer shippingAddress totalPrice isPaid isDelivered createdAt')
      .sort({ createdAt: -1 }).limit(8).lean(),
    Order.aggregate([
      { $match: paidRange },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'UTC' } },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      } },
      { $sort: { _id: 1 } },
    ]),
    Order.aggregate([
      { $match: paidRange },
      { $unwind: '$orderItems' },
      { $group: {
        _id: '$orderItems.product',
        name: { $first: '$orderItems.name' },
        unitsSold: { $sum: '$orderItems.qty' },
        revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.qty'] } },
      } },
      { $sort: { unitsSold: -1, revenue: -1 } },
      { $limit: 8 },
    ]),
  ]);

  const revenue = salesByDay.reduce((sum, day) => sum + day.revenue, 0);
  const soldItems = await Order.aggregate([
    { $match: paidRange },
    { $unwind: '$orderItems' },
    { $group: { _id: null, quantity: { $sum: '$orderItems.qty' } } },
  ]);

  res.json({
    period: { from: range.start.toISOString().slice(0, 10), to: range.end.toISOString().slice(0, 10) },
    totalOrders,
    totalProducts,
    totalCustomers,
    pendingOrders,
    paidOrders,
    revenue,
    deliveredRevenue: deliveredRevenue[0]?.revenue || 0,
    averageOrderValue: paidOrders ? revenue / paidOrders : 0,
    soldItems: soldItems[0]?.quantity || 0,
    lowStockThreshold: 5,
    lowStockCount,
    lowStockProducts,
    pendingAppointments,
    unreadMessages,
    recentOrders,
    salesByDay,
    topProducts,
  });
});

const getAdminAuditLogs = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Audit history is temporarily unavailable because the database is disconnected.' });
  }
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 50, 1), 200);
  const logs = await AdminAuditLog.find({})
    .populate('actor', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  res.json(logs);
});

export { getDashboardStats, getAdminAuditLogs };
