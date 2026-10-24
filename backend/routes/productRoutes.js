import express from 'express';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import multer from 'multer';
import { getProducts, getProductById, createProduct, createProductReview, reportProductReview, deleteProductReview, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protect, optionalProtect, admin } from '../middleware/authMiddleware.js';
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
  reviewUpload.array('media', 5)(req, res, async (error) => {
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    if (!req.body || typeof req.body !== 'object') {
      req.body = {};
    }
    try {
      for (const file of req.files || []) {
        const bytes = await fs.promises.readFile(file.path);
        const valid = file.mimetype === 'image/jpeg'
          ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
          : file.mimetype === 'image/png'
            ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
            : file.mimetype === 'image/webp'
              ? bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP'
              : file.mimetype === 'video/mp4'
                ? bytes.toString('ascii', 4, 8) === 'ftyp'
                : file.mimetype === 'video/webm'
                  ? bytes.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))
                  : false;
        if (!valid) {
          await removeReviewUploads(req.files || []).catch(() => {});
          return res.status(400).json({ message: 'A review attachment does not contain a supported media format.' });
        }
      }
    } catch (validationError) {
      await removeReviewUploads(req.files || []).catch(() => {});
      return res.status(500).json({ message: 'Review media could not be validated.' });
    }
    return next();
  });
};

router.route('/').get(cacheMiddleware(60), getProducts).post(protect, admin, createProduct);
router.route('/:id')
  .get(cacheMiddleware(300), getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);
router.route('/:id/reviews').post(optionalProtect, uploadReviewMedia, createProductReview);
router.post('/:id/reviews/:reviewId/report', protect, reportProductReview);
router.route('/:id/reviews/:reviewId').delete(protect, admin, deleteProductReview);

export default router;
