import asyncHandler from '../utils/asyncHandler.js';
import Wishlist from '../models/Wishlist.js';

const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  }
  res.json(wishlist);
});

const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    wishlist = new Wishlist({ user: req.user._id, products: [] });
  }

  const existIndex = wishlist.products.indexOf(productId);
  if (existIndex > -1) {
    wishlist.products.splice(existIndex, 1);
  } else {
    wishlist.products.push(productId);
  }

  await wishlist.save();
  const updatedWishlist = await Wishlist.findById(wishlist._id).populate('products');
  res.json(updatedWishlist);
});

export { getWishlist, toggleWishlist };
