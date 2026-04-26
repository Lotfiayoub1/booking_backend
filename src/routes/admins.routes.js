'use strict';

const router = require('express').Router();
const { users, nextId } = require('../data/store');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { AppError } = require('../utils/errors');

const safeUser = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, banned: u.banned, createdAt: u.createdAt });

router.use(authMiddleware, requireRole('super_admin'));

router.get('/', (req, res) => {
  const admins = users.filter((u) => u.role === 'admin');
  res.json({ success: true, data: admins.map(safeUser) });
});

router.post('/', (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new AppError('name, email and password are required', 400));
  }
  if (users.find((u) => u.email === email)) {
    return next(new AppError('Email already in use', 409));
  }
  const admin = { id: nextId('u'), name, email, password, role: 'admin', banned: false, createdAt: new Date().toISOString() };
  users.push(admin);
  res.status(201).json({ success: true, data: safeUser(admin) });
});

router.delete('/:id', (req, res, next) => {
  const idx = users.findIndex((u) => u.id === req.params.id && u.role === 'admin');
  if (idx === -1) return next(new AppError('Admin not found', 404));
  const [removed] = users.splice(idx, 1);
  res.json({ success: true, data: safeUser(removed) });
});

module.exports = router;
