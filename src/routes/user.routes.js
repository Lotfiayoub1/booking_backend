const router = require('express').Router();
const {
  listAdmins, getAdmin, createAdmin, updateAdmin, deleteAdmin, toggleSubscription,
} = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');
const { createUserValidator, updateUserValidator } = require('../validators/user.validator');
const { validate } = require('../middleware/validate.middleware');

// All user management routes require super_admin
router.use(authenticate, authorize('super_admin'));

router.get('/', listAdmins);
router.get('/:id', getAdmin);
router.post('/', createUserValidator, validate, createAdmin);
router.put('/:id', updateUserValidator, validate, updateAdmin);
router.delete('/:id', deleteAdmin);
router.patch('/:id/subscription', toggleSubscription);

module.exports = router;
