const router = require('express').Router();
const { listPublicSessions, getPublicSession } = require('../controllers/session.controller');
const { createBooking, cancelBooking, getBookingByRef } = require('../controllers/booking.controller');
const { createBookingValidator } = require('../validators/booking.validator');
const { validate } = require('../middleware/validate.middleware');

// Public — no authentication required

router.get('/sessions', listPublicSessions);
router.get('/sessions/:id', getPublicSession);
router.post('/sessions/:sessionId/book', createBookingValidator, validate, createBooking);
router.get('/bookings/:ref', getBookingByRef);
router.patch('/bookings/:ref/cancel', cancelBooking);

module.exports = router;
