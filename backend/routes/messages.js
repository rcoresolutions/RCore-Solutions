import express from 'express';
import rateLimit from 'express-rate-limit';
import Message from '../models/Message.js';
import asyncHandler from '../utils/asyncHandler.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 15,
  message: { message: 'You have sent too many messages. Please try again later.' },
});

router.post('/', limiter, asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  await Message.create({ name, email, phone, subject, message });
  res.status(201).json({ message: 'Thank you! Your message has been sent. We will reply soon.' });
}));

router.get('/', protect, adminOnly, asyncHandler(async (req, res) => {
  res.json(await Message.find().sort('-createdAt'));
}));

router.put('/:id/read', protect, adminOnly, asyncHandler(async (req, res) => {
  const msg = await Message.findByIdAndUpdate(req.params.id, { read: req.body.read !== false }, { new: true });
  if (!msg) return res.status(404).json({ message: 'Message not found.' });
  res.json(msg);
}));

router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  await Message.findByIdAndDelete(req.params.id);
  res.json({ message: 'Message deleted.' });
}));

export default router;
