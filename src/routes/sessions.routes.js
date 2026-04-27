'use strict';

const router = require('express').Router();
const { sessions, bookings, nextId } = require('../data/store');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { AppError } = require('../utils/errors');

const ADMIN_ROLES = ['admin', 'super_admin'];

router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
  const { subject, status } = req.query;

  let result = [...sessions];
  if (subject) result = result.filter((s) => s.subject.toLowerCase() === subject.toLowerCase());
  if (status)  result = result.filter((s) => s.status === status);

  const total = result.length;
  const data  = result.slice((page - 1) * limit, page * limit);
  res.json({ success: true, data, meta: { total, page, limit, pages: Math.ceil(total / limit) } });
});

router.get('/:id', (req, res, next) => {
  const session = sessions.find((s) => s.id === req.params.id);
  if (!session) return next(new AppError('Session not found', 404));
  res.json({ success: true, data: session });
});

router.post('/', authMiddleware, requireRole(...ADMIN_ROLES), (req, res, next) => {
  const { subject, title, description, date, duration, totalSlots } = req.body;
  if (!subject || !title || !date || !duration || !totalSlots) {
    return next(new AppError('subject, title, date, duration, totalSlots are required', 400));
  }
  const session = {
    id: nextId('s'),
    subject,
    title,
    description: description || '',
    date,
    duration: Number(duration),
    totalSlots: Number(totalSlots),
    availableSlots: Number(totalSlots),
    createdBy: req.user.id,
    status: 'active',
    createdAt: new Date().toISOString(),
  };
  sessions.push(session);
  res.status(201).json({ success: true, data: session });
});

router.put('/:id', authMiddleware, requireRole(...ADMIN_ROLES), (req, res, next) => {
  const idx = sessions.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return next(new AppError('Session not found', 404));
  const allowed = ['subject', 'title', 'description', 'date', 'duration', 'totalSlots', 'status'];
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) sessions[idx][key] = req.body[key];
  });
  if (req.body.totalSlots !== undefined) {
    const booked = bookings.filter((b) => b.sessionId === sessions[idx].id && b.status === 'booked').length;
    sessions[idx].availableSlots = Math.max(0, Number(req.body.totalSlots) - booked);
  }
  res.json({ success: true, data: sessions[idx] });
});

router.delete('/:id', authMiddleware, requireRole(...ADMIN_ROLES), (req, res, next) => {
  const idx = sessions.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return next(new AppError('Session not found', 404));
  const [removed] = sessions.splice(idx, 1);
  res.json({ success: true, data: removed });
});

router.get('/:id/bookings', authMiddleware, requireRole(...ADMIN_ROLES), (req, res, next) => {
  const session = sessions.find((s) => s.id === req.params.id);
  if (!session) return next(new AppError('Session not found', 404));
  const result = bookings.filter((b) => b.sessionId === req.params.id);
  res.json({ success: true, data: result });
});

module.exports = router;
