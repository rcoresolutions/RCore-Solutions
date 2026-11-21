import express from 'express';
import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Service from '../models/Service.js';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public: approved reviews for a target. Admin: everything with ?all=1
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const q = {};
  const admin = req.user?.role === 'admin' && req.query.all === '1';
  if (!admin) q.approved = true;
  if (req.query.targetType) q.targetType = req.query.targetType;
  if (req.query.targetId) {
    if (!mongoose.isValidObjectId(req.query.targetId)) return res.json([]);
    q.targetId = req.query.targetId;
  }
  let query = Review.find(q).populate('user', 'name').sort('-createdAt');
  if (req.query.limit) query = query.limit(Math.min(Number(req.query.limit) || 20, 100));
  res.json(await query);
}));

router.post('/', protect, asyncHandler(async (req, res) => {
  const { targetType = 'site', targetId = null, rating, comment } = req.body;
  let targetName = 'RCore Solutions';
  if (targetType === 'service' || targetType === 'product') {
    const Model = targetType === 'service' ? Service : Product;
    if (!mongoose.isValidObjectId(targetId)) return res.status(400).json({ message: 'Invalid item.' });
    const item = await Model.findById(targetId);
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    targetName = item.title || item.name;
  } else if (targetType !== 'site') {
    return res.status(400).json({ message: 'Invalid review type.' });
  }
  const exists = await Review.findOne({ user: req.user._id, targetType, targetId: targetType === 'site' ? null : targetId });
  if (exists) return res.status(400).json({ message: 'You have already reviewed this. Delete your review first to write a new one.' });
  const review = await Review.create({
    user: req.user._id,
    targetType,
    targetId: targetType === 'site' ? null : targetId,
    targetName,
    rating,
    comment,
  });
  res.status(201).json(await review.populate('user', 'name'));
}));

// Admin: show / hide a review
router.put('/:id/toggle', protect, adminOnly, asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: 'Review not found.' });
  review.approved = !review.approved;
  await review.save();
  res.json(review);
}));

// Owner or admin can delete
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: 'Review not found.' });
  if (req.user.role !== 'admin' && String(review.user) !== String(req.user._id)) {
    return res.status(403).json({ message: 'You can only delete your own reviews.' });
  }
  await review.deleteOne();
  res.json({ message: 'Review deleted.' });
}));

export default router;
