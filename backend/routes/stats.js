import express from 'express';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import Message from '../models/Message.js';
import asyncHandler from '../utils/asyncHandler.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const [users, services, products, reviews, unread, recentMessages, recentReviews] = await Promise.all([
    User.countDocuments(),
    Service.countDocuments(),
    Product.countDocuments(),
    Review.countDocuments(),
    Message.countDocuments({ read: false }),
    Message.find().sort('-createdAt').limit(5),
    Review.find().populate('user', 'name').sort('-createdAt').limit(5),
  ]);
  res.json({ users, services, products, reviews, unread, recentMessages, recentReviews });
}));

export default router;
