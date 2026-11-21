import express from 'express';
import Setting from '../models/Setting.js';
import asyncHandler from '../utils/asyncHandler.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

const getSettings = async () => (await Setting.findOne()) || (await Setting.create({}));

router.get('/', asyncHandler(async (req, res) => res.json(await getSettings())));

router.put('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const current = await getSettings();
  const { _id, __v, createdAt, updatedAt, ...data } = req.body;
  current.set(data);
  await current.save();
  res.json(current);
}));

export default router;
