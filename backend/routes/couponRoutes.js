const express = require('express');
const { createCoupon, getCoupons, validateCoupon, deleteCoupon } = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .post(protect, admin, createCoupon)
  .get(protect, admin, getCoupons);

router.route('/validate')
  .post(protect, validateCoupon);

router.route('/:id')
  .delete(protect, admin, deleteCoupon);

module.exports = router;
