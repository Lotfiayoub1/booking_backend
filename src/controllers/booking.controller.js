const { sequelize, Session, Booking } = require('../models');
const { success, created } = require('../utils/response');
const { NotFoundError, ConflictError, ForbiddenError } = require('../utils/errors');

const createBooking = async (req, res, next) => {
  // Use a transaction to prevent race conditions on capacity
  const t = await sequelize.transaction();
  try {
    const session = await Session.findOne({
      where: { id: req.params.sessionId, is_cancelled: false },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!session) {
      await t.rollback();
      throw new NotFoundError('Session not found or has been cancelled');
    }

    if (new Date(session.date_time) <= new Date()) {
      await t.rollback();
      return res.status(422).json({ success: false, message: 'This session has already passed' });
    }

    const activeBookings = await Booking.count({
      where: { session_id: session.id, is_cancelled: false },
      transaction: t,
    });

    if (activeBookings >= session.max_participants) {
      await t.rollback();
      return res.status(409).json({ success: false, message: 'This session is fully booked' });
    }

    const { student_name, student_email } = req.body;

    const booking = await Booking.create(
      { session_id: session.id, student_name, student_email },
      { transaction: t }
    );

    await t.commit();

    return created(res, booking, 'Booking confirmed');
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      where: { booking_ref: req.params.ref },
    });

    if (!booking) throw new NotFoundError('Booking not found');
    if (booking.is_cancelled) {
      return res.status(409).json({ success: false, message: 'Booking is already cancelled' });
    }

    await booking.update({ is_cancelled: true });
    return success(res, booking, 'Booking cancelled successfully');
  } catch (err) {
    next(err);
  }
};

const getBookingByRef = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      where: { booking_ref: req.params.ref },
      include: [{ model: Session, as: 'session', attributes: ['id', 'name', 'date_time', 'is_cancelled'] }],
    });
    if (!booking) throw new NotFoundError('Booking not found');
    return success(res, booking);
  } catch (err) {
    next(err);
  }
};

module.exports = { createBooking, cancelBooking, getBookingByRef };
