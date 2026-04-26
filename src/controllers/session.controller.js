const { Op } = require('sequelize');
const { Session, Booking, User } = require('../models');
const { success, created } = require('../utils/response');
const { NotFoundError, ForbiddenError } = require('../utils/errors');

// Shared helper: attach live booking count to a session instance
const withCounts = async (session) => {
  const active_bookings = await Booking.count({
    where: { session_id: session.id, is_cancelled: false },
  });
  return { ...session.toJSON(), active_bookings, available_spots: session.max_participants - active_bookings };
};

// ── Admin: CRUD ────────────────────────────────────────────────────────────────

const listSessions = async (req, res, next) => {
  try {
    const where = req.user.role === 'admin' ? { admin_id: req.user.id } : {};
    const sessions = await Session.findAll({
      where,
      include: [{ model: User, as: 'admin', attributes: ['id', 'name', 'email'] }],
      order: [['date_time', 'ASC']],
    });

    const withBookingCounts = await Promise.all(sessions.map(withCounts));
    return success(res, withBookingCounts, 'Sessions retrieved');
  } catch (err) {
    next(err);
  }
};

const getSession = async (req, res, next) => {
  try {
    const where = { id: req.params.id };
    if (req.user.role === 'admin') where.admin_id = req.user.id;

    const session = await Session.findOne({
      where,
      include: [{ model: User, as: 'admin', attributes: ['id', 'name', 'email'] }],
    });
    if (!session) throw new NotFoundError('Session not found');

    return success(res, await withCounts(session));
  } catch (err) {
    next(err);
  }
};

const createSession = async (req, res, next) => {
  try {
    const { name, description, date_time, max_participants } = req.body;
    const session = await Session.create({
      name,
      description,
      date_time,
      max_participants,
      admin_id: req.user.id,
    });
    return created(res, session, 'Session created');
  } catch (err) {
    next(err);
  }
};

const updateSession = async (req, res, next) => {
  try {
    const session = await Session.findOne({ where: { id: req.params.id } });
    if (!session) throw new NotFoundError('Session not found');

    // Admin can only modify their own sessions
    if (req.user.role === 'admin' && session.admin_id !== req.user.id) {
      throw new ForbiddenError('You can only update your own sessions');
    }

    const { name, description, date_time, max_participants } = req.body;

    // Prevent reducing capacity below current active bookings
    if (max_participants !== undefined) {
      const activeCount = await Booking.count({
        where: { session_id: session.id, is_cancelled: false },
      });
      if (max_participants < activeCount) {
        return res.status(422).json({
          success: false,
          message: `Cannot reduce capacity below current booking count (${activeCount})`,
        });
      }
    }

    await session.update({ name, description, date_time, max_participants });
    return success(res, await withCounts(session), 'Session updated');
  } catch (err) {
    next(err);
  }
};

const deleteSession = async (req, res, next) => {
  try {
    const session = await Session.findOne({ where: { id: req.params.id } });
    if (!session) throw new NotFoundError('Session not found');

    if (req.user.role === 'admin' && session.admin_id !== req.user.id) {
      throw new ForbiddenError('You can only delete your own sessions');
    }

    await session.destroy();
    return success(res, null, 'Session deleted');
  } catch (err) {
    next(err);
  }
};

const cancelSession = async (req, res, next) => {
  try {
    const session = await Session.findOne({ where: { id: req.params.id } });
    if (!session) throw new NotFoundError('Session not found');

    if (req.user.role === 'admin' && session.admin_id !== req.user.id) {
      throw new ForbiddenError('You can only cancel your own sessions');
    }

    await session.update({ is_cancelled: true });
    return success(res, session, 'Session cancelled');
  } catch (err) {
    next(err);
  }
};

const getSessionBookings = async (req, res, next) => {
  try {
    const where = { id: req.params.id };
    if (req.user.role === 'admin') where.admin_id = req.user.id;

    const session = await Session.findOne({ where });
    if (!session) throw new NotFoundError('Session not found');

    const bookings = await Booking.findAll({
      where: { session_id: session.id },
      order: [['created_at', 'ASC']],
    });
    return success(res, bookings, 'Session bookings retrieved');
  } catch (err) {
    next(err);
  }
};

// ── Public: Student-facing ─────────────────────────────────────────────────────

const listPublicSessions = async (req, res, next) => {
  try {
    const sessions = await Session.findAll({
      where: {
        is_cancelled: false,
        date_time: { [Op.gt]: new Date() },
      },
      include: [{ model: User, as: 'admin', attributes: ['id', 'name'] }],
      order: [['date_time', 'ASC']],
    });

    const withSpots = await Promise.all(sessions.map(withCounts));
    // Only return sessions that still have spots
    const available = withSpots.filter((s) => s.available_spots > 0);
    return success(res, available, 'Available sessions retrieved');
  } catch (err) {
    next(err);
  }
};

const getPublicSession = async (req, res, next) => {
  try {
    const session = await Session.findOne({
      where: { id: req.params.id, is_cancelled: false },
      include: [{ model: User, as: 'admin', attributes: ['id', 'name'] }],
    });
    if (!session) throw new NotFoundError('Session not found or no longer available');
    return success(res, await withCounts(session));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listSessions,
  getSession,
  createSession,
  updateSession,
  deleteSession,
  cancelSession,
  getSessionBookings,
  listPublicSessions,
  getPublicSession,
};
