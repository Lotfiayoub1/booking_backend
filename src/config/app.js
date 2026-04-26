const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler } = require('../middleware/error.middleware');

const app = express();

// Security headers
app.use(helmet());

// CORS — in production, restrict origin to your frontend domain
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Return 503 on data routes until the database is ready
app.use('/api', (req, res, next) => {
  if (!app.locals.dbReady && req.path !== '/health') {
    return res.status(503).json({ success: false, message: 'Service unavailable — database not connected yet' });
  }
  next();
});

// API routes
app.use('/api', require('../routes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
