'use strict';

const router = require('express').Router();

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

router.use('/auth',     require('./auth.routes'));
router.use('/sessions', require('./sessions.routes'));
router.use('/bookings', require('./bookings.routes'));
router.use('/admins',   require('./admins.routes'));
router.use('/users',    require('./users.routes'));

module.exports = router;
