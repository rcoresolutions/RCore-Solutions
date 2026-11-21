// Local / traditional server entry. (Vercel uses api/index.js instead.)
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
