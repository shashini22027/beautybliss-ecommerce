import asyncHandler from '../utils/asyncHandler.js';
import Order from '../models/Order.js';

const POINTS_PER_LKR = 100;

export const getMyRewards = asyncHandler(async (req, res) => {
  const eligibleOrders = await Order.find({
    user: req.user._id,
    isPaid: true,
    'paymentResult.status': { $nin: ['refunded', 'refund_pending'] },
  })
    .select('orderNo totalPrice paidAt')
    .sort({ paidAt: -1 })
    .lean();

  const eligibleSpend = eligibleOrders.reduce((sum, order) => sum + Math.max(0, Number(order.totalPrice) || 0), 0);
  const points = eligibleOrders.reduce(
    (sum, order) => sum + Math.floor(Math.max(0, Number(order.totalPrice) || 0) / POINTS_PER_LKR),
    0
  );

  res.json({
    points,
    eligibleSpend,
    eligibleOrderCount: eligibleOrders.length,
    pointsPerLkr: POINTS_PER_LKR,
    expires: false,
    recentEligibleOrders: eligibleOrders.slice(0, 10).map((order) => ({
      orderNo: order.orderNo,
      points: Math.floor(Math.max(0, Number(order.totalPrice) || 0) / POINTS_PER_LKR),
      paidAt: order.paidAt,
    })),
  });
});
