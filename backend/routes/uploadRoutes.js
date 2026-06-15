import fs from 'fs';
import path from 'path';
// Ensure uploads directory exists
const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
import express from 'express';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only (jpg, jpeg, png, webp)!'));
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post(
  '/',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 5 },
  ]),
  (req, res) => {
    const uploadedFiles = [
      ...(req.files?.image || []),
      ...(req.files?.images || []),
    ];

    if (!uploadedFiles.length) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const urls = uploadedFiles.map((file) => `/uploads/${file.filename}`);
    res.status(200).json({
      url: urls[0],
      urls,
      message: 'Image uploaded successfully',
    });
  }
);

export default router;
