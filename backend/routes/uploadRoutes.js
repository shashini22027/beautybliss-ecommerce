import express from 'express';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import multer from 'multer';
import { protect, admin } from '../middleware/authMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();
const uploadsDir = path.resolve('uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const allowedTypes = {
  '.jpg': { mime: 'image/jpeg', signature: (bytes) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff },
  '.jpeg': { mime: 'image/jpeg', signature: (bytes) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff },
  '.png': { mime: 'image/png', signature: (bytes) => bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) },
  '.webp': { mime: 'image/webp', signature: (bytes) => bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP' },
};

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadsDir),
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${randomUUID()}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 6, fields: 10, parts: 18 },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const allowed = allowedTypes[extension];
    if (!allowed || file.mimetype !== allowed.mime) {
      return callback(new Error('Upload a valid JPG, PNG, or WebP image.'));
    }
    return callback(null, true);
  },
});

router.post('/', protect, admin, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 5 },
]), asyncHandler(async (req, res) => {
  const uploadedFiles = [...(req.files?.image || []), ...(req.files?.images || [])];
  if (!uploadedFiles.length) return res.status(400).json({ message: 'No file uploaded.' });

  const validFiles = [];
  for (const file of uploadedFiles) {
    const bytes = await fs.promises.readFile(file.path);
    const validator = allowedTypes[path.extname(file.originalname).toLowerCase()];
    if (!validator?.signature(bytes)) {
      await fs.promises.unlink(file.path);
      await Promise.all(validFiles.map((validFile) => fs.promises.unlink(validFile.path)));
      return res.status(400).json({ message: 'The uploaded file content is not a supported image.' });
    }
    validFiles.push(file);
  }

  const urls = validFiles.map((file) => `/uploads/${file.filename}`);
  return res.status(201).json({ url: urls[0], urls, message: 'Images uploaded successfully.' });
}));

router.use((error, _req, res, next) => {
  if (error instanceof multer.MulterError) {
    const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    return res.status(status).json({ message: error.code === 'LIMIT_FILE_SIZE' ? 'Each image must be 5 MB or smaller.' : 'The upload contains too many files or fields.' });
  }
  if (error) return res.status(400).json({ message: error.message || 'Image upload failed.' });
  return next();
});

export default router;
