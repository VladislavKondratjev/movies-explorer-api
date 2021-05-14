const router = require('express').Router();
const userRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlwares/auth');
const { login, createUser } = require('../controllers/users');
const {
  loginValidation,
  createUserValidation,
} = require('../middlwares/validations');

router.post('/signin', loginValidation, login);
router.post('/signup', createUserValidation, createUser);
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', moviesRouter);

module.exports = { router };
