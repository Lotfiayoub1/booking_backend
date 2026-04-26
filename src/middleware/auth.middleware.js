'use strict';

const { users } = require('../data/store');
const { AppError } = require('../utils/errors');

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 401));
  }
  const userId = header.slice(7);
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return next(new AppError('Invalid token', 401));
  }
  if (user.banned) {
    return next(new AppError('Account is banned', 403));
  }
  req.user = user;
  next();
};

module.exports = { authMiddleware };
