import express from 'express';
import mongoose from 'mongoose';
import asyncHandler from '../utils/asyncHandler.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const isAdmin = (req) => req.user?.role === 'admin';

/**
 * Builds a REST router for a content model (services, products).
 * Public: list + read (active items only). Admin: create, update, delete, list all (?all=1).
 */
export default function crudRouter(Model, { searchFields = [], label = 'Item' } = {}) {
  const router = express.Router();

  router.get('/', optionalAuth, asyncHandler(async (req, res) => {
    const q = {};
    if (!(isAdmin(req) && req.query.all === '1')) q.active = true;
    if (req.query.category) q.category = req.query.category;
    if (req.query.featured === '1') q.featured = true;
    if (req.query.search) {
      const rx = new RegExp(escapeRegex(String(req.query.search)), 'i');
      q.$or = searchFields.map((f) => ({ [f]: rx }));
    }
    let query = Model.find(q).sort('-createdAt');
    if (req.query.limit) query = query.limit(Math.min(Number(req.query.limit) || 50, 200));
    res.json(await query);
  }));

  router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: `${label} not found.` });
    const doc = await Model.findById(req.params.id);
    if (!doc || (!doc.active && !isAdmin(req))) return res.status(404).json({ message: `${label} not found.` });
    res.json(doc);
  }));

  router.post('/', protect, adminOnly, asyncHandler(async (req, res) => {
    res.status(201).json(await Model.create(req.body));
  }));

  router.put('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: `${label} not found.` });
    res.json(doc);
  }));

  router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: `${label} not found.` });
    res.json({ message: `${label} deleted.` });
  }));

  return router;
}
