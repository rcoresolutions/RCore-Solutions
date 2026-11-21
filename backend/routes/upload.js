import express from 'express';
import multer from 'multer';
import Image from '../models/Image.js';
import asyncHandler from '../utils/asyncHandler.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Images are kept in MongoDB (works on Vercel, where the disk is read-only).
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) return cb(null, true);
    cb(Object.assign(new Error('Only JPG, PNG, WEBP or GIF images are allowed.'), { status: 400 }));
  },
});

router.post('/', protect, adminOnly, upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Choose an image to upload.' });
  const img = await Image.create({ data: req.file.buffer, contentType: req.file.mimetype });
  res.status(201).json({ url: `/api/images/${img._id}` });
}));

export default router;
