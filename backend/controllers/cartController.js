import asyncHandler from '../utils/asyncHandler.js';
import Cart from '../models/Cart.js';

const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, cartItems: [] });
  }
  res.json(cart);
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, qty } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, cartItems: [] });
  }

  const existItemIndex = cart.cartItems.findIndex(x => x.product.toString() === productId);
  if (existItemIndex > -1) {
    cart.cartItems[existItemIndex].qty = qty;
  } else {
    cart.cartItems.push({ product: productId, qty });
  }

  await cart.save();
  res.status(201).json(cart);
});

const removeFromCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.cartItems = cart.cartItems.filter(x => x.product.toString() !== req.params.id);
    await cart.save();
  }
  res.json(cart);
});

export { getCart, addToCart, removeFromCart };
