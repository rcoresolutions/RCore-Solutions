import express from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please try again in a few minutes.' },
});

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const payload = (u) => ({ _id: u._id, name: u.name, email: u.email, role: u.role });

router.post('/register', limiter, asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email: String(email || '').toLowerCase() });
  if (exists) return res.status(400).json({ message: 'An account with this email already exists.' });
  // Public registration always creates a normal user. Admins are created by admins only.
  const user = await User.create({ name, email, password, role: 'user' });
  res.status(201).json({ token: signToken(user._id), user: payload(user) });
}));

router.post('/login', limiter, asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Enter your email and password.' });
  const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Email or password is incorrect.' });
  }
  if (!user.active) return res.status(403).json({ message: 'This account has been disabled. Please contact support.' });
  res.json({ token: signToken(user._id), user: payload(user) });
}));

router.get('/me', protect, (req, res) => res.json({ user: payload(req.user) }));

router.put('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  if (req.body.name) user.name = req.body.name;
  if (req.body.newPassword) {
    if (!req.body.currentPassword || !(await user.matchPassword(req.body.currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }
    user.password = req.body.newPassword;
  }
  await user.save();
  res.json({ user: payload(user) });
}));

export default router;
