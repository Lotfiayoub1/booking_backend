const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { UnauthorizedError } = require('../utils/errors');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      throw new UnauthorizedError('Invalid or expired token');
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw new UnauthorizedError('User no longer exists');
    }

    // Admin subscription check on every authenticated request
    if (user.role === 'admin' && !user.subscription_active) {
      throw new UnauthorizedError('Your subscription is inactive. Contact the administrator.');
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { authenticate };
