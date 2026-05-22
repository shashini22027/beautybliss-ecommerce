import asyncHandler from '../utils/asyncHandler.js';
import Coupon from '../models/Coupon.js';

// @desc    Create a new coupon
// @route   POST /api/coupon
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
  const { code, discountType, discountAmount, expiryDate } = req.body;

  const couponExists = await Coupon.findOne({ code });
  if (couponExists) {
    return res.status(400).json({ message: 'Coupon code already exists' });
  }

  const coupon = await Coupon.create({
    code,
    discountType,
    discountAmount,
    expiryDate
  });

  res.status(201).json(coupon);
});

// @desc    Get all coupons
// @route   GET /api/coupon
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({});
  res.json(coupons);
});

// @desc    Validate a coupon code
// @route   POST /api/coupon/validate
// @access  Private
const validateCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) {
    return res.status(404).json({ message: 'Invalid coupon code' });
  }

  if (!coupon.isActive) {
    return res.status(400).json({ message: 'Coupon is inactive' });
  }

  if (coupon.isExpired()) {
    return res.status(400).json({ message: 'Coupon has expired' });
  }

  res.json({
    code: coupon.code,
    discountType: coupon.discountType,
    discountAmount: coupon.discountAmount
  });
});

// @desc    Delete a coupon
// @route   DELETE /api/coupon/:id
// @access  Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    return res.status(404).json({ message: 'Coupon not found' });
  }

  await coupon.deleteOne();
  res.json({ message: 'Coupon removed successfully' });
});

export {
  createCoupon,
  getCoupons,
  validateCoupon,
  deleteCoupon
};
