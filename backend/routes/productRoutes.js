import express from 'express';
import { getProducts, getProductById, createProduct, createProductReview, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import cacheMiddleware from '../middleware/cacheMiddleware.js';
const router = express.Router();

router.route('/').get(cacheMiddleware(60), getProducts).post(protect, admin, createProduct);
router.route('/:id')
  .get(cacheMiddleware(300), getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);
router.route('/:id/reviews').post(protect, createProductReview);

export default router;
