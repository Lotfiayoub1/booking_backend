const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { success } = require('../utils/response');
const { UnauthorizedError } = require('../utils/errors');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      // Include password for comparison (toJSON strips it)
      attributes: { include: ['password'] },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Subscription gate for admin role
    if (user.role === 'admin' && !user.subscription_active) {
      throw new UnauthorizedError('Your subscription is inactive. Contact the super administrator.');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    return success(res, { token, user }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

const me = async (req, res, next) => {
  try {
    return success(res, req.user, 'Authenticated user');
  } catch (err) {
    next(err);
  }
};

module.exports = { login, me };
