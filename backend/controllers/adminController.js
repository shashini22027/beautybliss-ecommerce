const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
