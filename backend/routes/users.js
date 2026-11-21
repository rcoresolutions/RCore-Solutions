import express from 'express';
import User from '../models/User.js';
import Review from '../models/Review.js';
import asyncHandler from '../utils/asyncHandler.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();
router.use(protect, adminOnly);

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

router.get('/', asyncHandler(async (req, res) => {
  const q = {};
  if (req.query.role) q.role = req.query.role;
  if (req.query.search) {
    const rx = new RegExp(escapeRegex(String(req.query.search)), 'i');
    q.$or = [{ name: rx }, { email: rx }];
  }
  res.json(await User.find(q).sort('-createdAt'));
}));

router.post('/', asyncHandler(async (req, res) => {
  const { name, email, password, role, active } = req.body;
  const user = await User.create({ name, email, password, role: role === 'admin' ? 'admin' : 'user', active: active !== false });
  const out = user.toObject();
  delete out.password;
  res.status(201).json(out);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  const { name, email, password, role, active } = req.body;
  const isSelf = String(user._id) === String(req.user._id);
  if (isSelf && (role === 'user' || active === false)) {
    return res.status(400).json({ message: 'You cannot remove your own admin access or disable your own account.' });
  }
  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (role) user.role = role === 'admin' ? 'admin' : 'user';
  if (active !== undefined) user.active = !!active;
  if (password) user.password = password;
  await user.save();
  const out = user.toObject();
  delete out.password;
  res.json(out);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  if (String(req.params.id) === String(req.user._id)) {
    return res.status(400).json({ message: 'You cannot delete your own account.' });
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  await Review.deleteMany({ user: user._id });
  res.json({ message: 'User deleted.' });
}));

export default router;
