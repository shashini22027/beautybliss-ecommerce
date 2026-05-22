import Coupon from '../models/Coupon.js';

// @desc    Create a new coupon
// @route   POST /api/coupon
// @access  Private/Admin
const createCoupon = async (req, res) => {
  const { code, discountType, discountAmount, expiryDate } = req.body;

  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all coupons
// @route   GET /api/coupon
// @access  Private/Admin
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Validate a coupon code
// @route   POST /api/coupon/validate
// @access  Private
const validateCoupon = async (req, res) => {
  const { code } = req.body;

  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupon/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    await coupon.deleteOne();
    res.json({ message: 'Coupon removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createCoupon,
  getCoupons,
  validateCoupon,
  deleteCoupon
};
