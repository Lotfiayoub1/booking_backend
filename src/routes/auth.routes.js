'use strict';

const router = require('express').Router();
const { users, nextId } = require('../data/store');
const { AppError } = require('../utils/errors');

const safeUser = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, banned: u.banned, createdAt: u.createdAt });

router.post('/register', (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new AppError('name, email and password are required', 400));
  }
  if (users.find((u) => u.email === email)) {
    return next(new AppError('Email already in use', 409));
  }
  const user = { id: nextId('u'), name, email, password, role: 'student', banned: false, createdAt: new Date().toISOString() };
  users.push(user);
  res.status(201).json({ success: true, data: { user: safeUser(user), token: user.id } });
});

router.post('/login', (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('email and password are required', 400));
  }
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return next(new AppError('Invalid credentials', 401));
  if (user.banned) return next(new AppError('Account is banned', 403));
  res.json({ success: true, data: { user: safeUser(user), token: user.id } });
});

router.get('/me', (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 401));
  }
  const userId = header.slice(7);
  const user = users.find((u) => u.id === userId);
  if (!user) return next(new AppError('User not found', 404));
  res.json({ success: true, data: safeUser(user) });
});

module.exports = router;
