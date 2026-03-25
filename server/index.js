import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import challengesRoutes from './routes/challenges.js';
import blogRoutes from './routes/blog.js';
import { testConnection } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengesRoutes);
app.use('/api/blog', blogRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Start server
async function start() {
  const dbConnected = await testConnection();

  app.listen(PORT, () => {
    if (dbConnected) {
      console.log(`🚀 Frozen Space API running on http://localhost:${PORT}`);
    } else {
      console.log(`⚠️  Server running WITHOUT database on http://localhost:${PORT}`);
    }
  });
}

start();
