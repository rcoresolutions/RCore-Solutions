import express from 'express';
import mongoose from 'mongoose';
import Image from '../models/Image.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.get('/:id', asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).end();
  const img = await Image.findById(req.params.id);
  if (!img) return res.status(404).end();
  res.set('Content-Type', img.contentType);
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  res.send(img.data);
}));

export default router;
