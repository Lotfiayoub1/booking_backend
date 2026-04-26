const { User } = require('../models');
const { success, created, error } = require('../utils/response');
const { NotFoundError, ConflictError } = require('../utils/errors');

const listAdmins = async (req, res, next) => {
  try {
    const users = await User.findAll({
      where: { role: 'admin' },
      order: [['created_at', 'DESC']],
    });
    return success(res, users, 'Admin users retrieved');
  } catch (err) {
    next(err);
  }
};

const getAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id, role: 'admin' } });
    if (!user) throw new NotFoundError('Admin user not found');
    return success(res, user);
  } catch (err) {
    next(err);
  }
};

const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) throw new ConflictError('Email is already in use');

    const user = await User.create({ name, email, password, role: 'admin' });
    return created(res, user, 'Admin user created');
  } catch (err) {
    next(err);
  }
};

const updateAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id, role: 'admin' } });
    if (!user) throw new NotFoundError('Admin user not found');

    const { name, email, password } = req.body;

    if (email && email !== user.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) throw new ConflictError('Email is already in use');
    }

    await user.update({ name, email, password });
    return success(res, user, 'Admin user updated');
  } catch (err) {
    next(err);
  }
};

const deleteAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id, role: 'admin' } });
    if (!user) throw new NotFoundError('Admin user not found');
    await user.destroy();
    return success(res, null, 'Admin user deleted');
  } catch (err) {
    next(err);
  }
};

const toggleSubscription = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id, role: 'admin' } });
    if (!user) throw new NotFoundError('Admin user not found');

    await user.update({ subscription_active: !user.subscription_active });
    const state = user.subscription_active ? 'activated' : 'deactivated';
    return success(res, user, `Subscription ${state}`);
  } catch (err) {
    next(err);
  }
};

module.exports = { listAdmins, getAdmin, createAdmin, updateAdmin, deleteAdmin, toggleSubscription };
