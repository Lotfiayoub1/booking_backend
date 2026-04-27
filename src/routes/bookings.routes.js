'use strict';

const router = require('express').Router();
const { sessions, bookings, users, nextId } = require('../data/store');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { AppError } = require('../utils/errors');

router.post('/', authMiddleware, requireRole('student'), (req, res, next) => {
  const { sessionId } = req.body;
  if (!sessionId) return next(new AppError('sessionId is required', 400));

  const session = sessions.find((s) => s.id === sessionId);
  if (!session) return next(new AppError('Session not found', 404));
  if (session.status !== 'active') return next(new AppError('Session is not available', 400));
  if (session.availableSlots <= 0) return next(new AppError('No slots available', 400));

  const alreadyBooked = bookings.find((b) => b.studentId === req.user.id && b.sessionId === sessionId && b.status === 'booked');
  if (alreadyBooked) return next(new AppError('Already booked this session', 409));

  const booking = { id: nextId('b'), studentId: req.user.id, sessionId, status: 'booked', createdAt: new Date().toISOString() };
  bookings.push(booking);
  session.availableSlots -= 1;

  res.status(201).json({ success: true, data: booking });
});

router.get('/me', authMiddleware, requireRole('student'), (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
  const result = bookings.filter((b) => b.studentId === req.user.id);
  const enriched = result.map((b) => ({ ...b, session: sessions.find((s) => s.id === b.sessionId) || null }));
  const total = enriched.length;
  res.json({ success: true, data: enriched.slice((page - 1) * limit, page * limit), meta: { total, page, limit } });
});

router.get('/', authMiddleware, requireRole('admin', 'super_admin'), (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
  const enriched = bookings.map((b) => ({
    ...b,
    session: sessions.find((s) => s.id === b.sessionId) || null,
    student: (() => { const u = users.find((u) => u.id === b.studentId); return u ? { id: u.id, name: u.name, email: u.email } : null; })(),
  }));
  const total = enriched.length;
  res.json({ success: true, data: enriched.slice((page - 1) * limit, page * limit), meta: { total, page, limit } });
});

router.delete('/:id', authMiddleware, (req, res, next) => {
  const idx = bookings.findIndex((b) => b.id === req.params.id);
  if (idx === -1) return next(new AppError('Booking not found', 404));
  const booking = bookings[idx];
  const isOwner = req.user.role === 'student' && booking.studentId === req.user.id;
  const isAdmin  = ['admin', 'super_admin'].includes(req.user.role);
  if (!isOwner && !isAdmin) return next(new AppError('Forbidden', 403));
  bookings[idx].status = 'cancelled';
  const session = sessions.find((s) => s.id === booking.sessionId);
  if (session) session.availableSlots += 1;
  res.json({ success: true, data: bookings[idx] });
});

module.exports = router;
