import asyncHandler from '../utils/asyncHandler.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const getDashboardStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments({});
  const totalProducts = await Product.countDocuments({});
  const totalUsers = await User.countDocuments({});
  
  const orders = await Order.find({});
  const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  res.json({
    totalOrders,
    totalProducts,
    totalUsers,
    totalSales
  });
});

export { getDashboardStats };
