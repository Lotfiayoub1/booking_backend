const router = require('express').Router();
const { login, me } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { loginValidator } = require('../validators/auth.validator');
const { validate } = require('../middleware/validate.middleware');

router.post('/login', loginValidator, validate, login);
router.get('/me', authenticate, me);

module.exports = router;
