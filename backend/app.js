import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/error.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import serviceRoutes from './routes/services.js';
import productRoutes from './routes/products.js';
import reviewRoutes from './routes/reviews.js';
import messageRoutes from './routes/messages.js';
import settingRoutes from './routes/settings.js';
import uploadRoutes from './routes/upload.js';
import imageRoutes from './routes/images.js';
import statsRoutes from './routes/stats.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.set('trust proxy', 1); // needed behind Vercel / proxies (rate limiting, IPs)
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' }, contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((s) => s.trim()) : true }));
app.use(express.json({ limit: '1mb' }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Connect to MongoDB lazily (works for both local server and serverless).
app.use('/api', async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set.');
    await connectDB();
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server is not configured correctly. Check environment variables and database access.' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api', notFound);

// Optional: when running as a single server, serve the built React app.
const dist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.use(errorHandler);

export default app;
