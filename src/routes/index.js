const router = require('express').Router();

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

// Auth
router.post('/auth/login', (req, res) => {
  res.json({ success: true, message: 'Auth endpoint — coming soon' });
});

// Admin user management
router.get('/admin/users', (req, res) => {
  res.json({ success: true, data: [], message: 'User list — coming soon' });
});
router.post('/admin/users', (req, res) => {
  res.status(201).json({ success: true, message: 'Create user — coming soon' });
});
router.put('/admin/users/:id', (req, res) => {
  res.json({ success: true, message: 'Update user — coming soon' });
});
router.delete('/admin/users/:id', (req, res) => {
  res.json({ success: true, message: 'Delete user — coming soon' });
});
router.patch('/admin/users/:id/subscription', (req, res) => {
  res.json({ success: true, message: 'Toggle subscription — coming soon' });
});

// Session management (admin)
router.get('/sessions', (req, res) => {
  res.json({ success: true, data: [], message: 'Session list — coming soon' });
});
router.post('/sessions', (req, res) => {
  res.status(201).json({ success: true, message: 'Create session — coming soon' });
});
router.put('/sessions/:id', (req, res) => {
  res.json({ success: true, message: 'Update session — coming soon' });
});
router.delete('/sessions/:id', (req, res) => {
  res.json({ success: true, message: 'Delete session — coming soon' });
});
router.patch('/sessions/:id/cancel', (req, res) => {
  res.json({ success: true, message: 'Cancel session — coming soon' });
});
router.get('/sessions/:id/bookings', (req, res) => {
  res.json({ success: true, data: [], message: 'Session bookings — coming soon' });
});

// Public (students — no auth)
router.get('/public/sessions', (req, res) => {
  res.json({ success: true, data: [], message: 'Available sessions — coming soon' });
});
router.get('/public/sessions/:id', (req, res) => {
  res.json({ success: true, data: {}, message: 'Session detail — coming soon' });
});
router.post('/public/sessions/:sessionId/book', (req, res) => {
  res.status(201).json({ success: true, message: 'Booking — coming soon' });
});
router.get('/public/bookings/:ref', (req, res) => {
  res.json({ success: true, data: {}, message: 'Booking lookup — coming soon' });
});
router.patch('/public/bookings/:ref/cancel', (req, res) => {
  res.json({ success: true, message: 'Booking cancellation — coming soon' });
});

module.exports = router;
