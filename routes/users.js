const router = require('express').Router();

const {
  getUserInfo,
  updateUserInfo,
} = require('../controllers/users');
const {
  authValidation,
  updateUserInfoValidation,
} = require('../middlwares/validations');

router.get('/me', authValidation, getUserInfo);
router.patch('/me', updateUserInfoValidation, updateUserInfo);

module.exports = router;
