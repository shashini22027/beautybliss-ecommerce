import express from 'express';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import multer from 'multer';
import { getProducts, getProductById, createProduct, createProductReview, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import cacheMiddleware from '../middleware/cacheMiddleware.js';
const router = express.Router();

const reviewUploadDirectory = path.resolve('uploads/reviews');
fs.mkdirSync(reviewUploadDirectory, { recursive: true });

const reviewMediaExtensions = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
};

const reviewUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, reviewUploadDirectory),
    filename: (_req, file, callback) => {
      callback(null, `review-${Date.now()}-${randomUUID()}${reviewMediaExtensions[file.mimetype]}`);
    },
  }),
  limits: { files: 5, fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (reviewMediaExtensions[file.mimetype]) {
      callback(null, true);
    } else {
      callback(new Error('Review media must be JPG, PNG, WebP, MP4, or WebM.'));
    }
  },
});

const uploadReviewMedia = (req, res, next) => {
  reviewUpload.array('media', 5)(req, res, (error) => {
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    if (!req.body || typeof req.body !== 'object') {
      req.body = {};
    }
    return next();
  });
};

router.route('/').get(cacheMiddleware(60), getProducts).post(protect, admin, createProduct);
router.route('/:id')
  .get(cacheMiddleware(300), getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);
router.route('/:id/reviews').post(uploadReviewMedia, createProductReview);

export default router;
