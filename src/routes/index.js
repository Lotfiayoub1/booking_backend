const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/admin/users', require('./user.routes'));
router.use('/sessions', require('./session.routes'));
router.use('/public', require('./public.routes'));

// Health check
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

module.exports = router;
