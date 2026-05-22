import Order from '../models/Order.js';

const addOrderItems = async (req, res) => {
  const { orderItems, shippingAddress, totalPrice } = req.body;
  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  }
  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    totalPrice
  });
  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
};

const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (order) res.json(order);
  else res.status(404).json({ message: 'Order not found' });
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

export { addOrderItems, getOrderById, getMyOrders, updateOrderToDelivered };
