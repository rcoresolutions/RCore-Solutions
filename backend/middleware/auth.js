import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

const getToken = (req) => {
  const h = req.headers.authorization;
  return h && h.startsWith('Bearer ') ? h.split(' ')[1] : null;
};

export const protect = asyncHandler(async (req, res, next) => {
  const token = getToken(req);
  if (!token) return res.status(401).json({ message: 'Please log in to continue.' });
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
  }
  const user = await User.findById(decoded.id);
  if (!user || !user.active) {
    return res.status(401).json({ message: 'This account does not exist or has been disabled.' });
  }
  req.user = user;
  next();
});

// Attaches req.user when a valid token is sent, but never blocks the request.
export const optionalAuth = async (req, res, next) => {
  try {
    const token = getToken(req);
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user && user.active) req.user = user;
    }
  } catch { /* ignore invalid tokens on public routes */ }
  next();
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  res.status(403).json({ message: 'Admin access is required.' });
};
