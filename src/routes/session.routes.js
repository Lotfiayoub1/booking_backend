const router = require('express').Router();
const {
  listSessions, getSession, createSession, updateSession,
  deleteSession, cancelSession, getSessionBookings,
} = require('../controllers/session.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');
const { createSessionValidator, updateSessionValidator } = require('../validators/session.validator');
const { validate } = require('../middleware/validate.middleware');

// All session management routes require authentication
router.use(authenticate, authorize('admin', 'super_admin'));

router.get('/', listSessions);
router.get('/:id', getSession);
router.post('/', createSessionValidator, validate, createSession);
router.put('/:id', updateSessionValidator, validate, updateSession);
router.delete('/:id', deleteSession);
router.patch('/:id/cancel', cancelSession);
router.get('/:id/bookings', getSessionBookings);

module.exports = router;
