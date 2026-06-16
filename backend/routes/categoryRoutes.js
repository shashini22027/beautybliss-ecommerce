import express from 'express';
import { getCategories, createCategory } from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import cacheMiddleware from '../middleware/cacheMiddleware.js';
const router = express.Router();

router.route('/').get(cacheMiddleware(600), getCategories).post(protect, admin, createCategory);

export default router;
