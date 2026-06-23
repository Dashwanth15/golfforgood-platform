import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { envConfig } from './config/env';
import { errorHandler } from './middleware/error.middleware';

// Routes
import authRoutes        from './modules/auth/auth.routes';
import scoresRoutes      from './modules/scores/scores.routes';
import charitiesRoutes   from './modules/charities/charities.routes';
import drawsRoutes       from './modules/draws/draws.routes';
import winnersRoutes     from './modules/winners/winners.routes';
import subscriptionsRoutes from './modules/subscriptions/subscriptions.routes';
import adminRoutes       from './modules/admin/admin.routes';
import profileRoutes     from './modules/profile/profile.routes';

import { supabase } from './config/database';

const app = express();

// ── Security & Parsing ────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: [envConfig.FRONTEND_URL, 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health Check ──────────────────────────────────────────────────
app.get('/api/health', async (_req, res) => {
  try {
    const { error } = await supabase.from('users').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    res.json({
      success: true,
      status: 'GolfForGood API running',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Database health check failed:', err.message || err);
    res.status(503).json({
      success: false,
      status: 'GolfForGood API running with issues',
      database: 'disconnected',
      error: err.message || 'Database error',
      timestamp: new Date().toISOString()
    });
  }
});

// ── API Routes ────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/scores',        scoresRoutes);
app.use('/api/charities',     charitiesRoutes);
app.use('/api/draws',         drawsRoutes);
app.use('/api/winners',       winnersRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/admin',         adminRoutes);
app.use('/api/profile',       profileRoutes);

// ── 404 ───────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found', error: 'NOT_FOUND' });
});

// ── Global Error Handler ──────────────────────────────────────────
app.use(errorHandler);

export default app;
