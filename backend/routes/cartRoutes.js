const express = require('express');
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getCart).post(protect, addToCart);
router.route('/:id').delete(protect, removeFromCart);

module.exports = router;
