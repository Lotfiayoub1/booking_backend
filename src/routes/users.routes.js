'use strict';

const router = require('express').Router();
const { users } = require('../data/store');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { AppError } = require('../utils/errors');

const safeUser = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, banned: u.banned, createdAt: u.createdAt });

router.use(authMiddleware, requireRole('admin', 'super_admin'));

router.get('/', (req, res) => {
  const page  = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
  const students = users.filter((u) => u.role === 'student');
  const total = students.length;
  res.json({ success: true, data: students.slice((page - 1) * limit, page * limit).map(safeUser), meta: { total, page, limit } });
});

router.patch('/:id/ban', (req, res, next) => {
  const user = users.find((u) => u.id === req.params.id && u.role === 'student');
  if (!user) return next(new AppError('Student not found', 404));
  user.banned = !user.banned;
  res.json({ success: true, data: safeUser(user) });
});

router.put('/:id', (req, res, next) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return next(new AppError('User not found', 404));
  const allowed = ['name', 'email'];
  allowed.forEach((key) => { if (req.body[key] !== undefined) user[key] = req.body[key]; });
  res.json({ success: true, data: safeUser(user) });
});

module.exports = router;
