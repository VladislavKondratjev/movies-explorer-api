const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const Conflict = require('../errors/conflict-error');
const UnathorizedError = require('../errors/unathorized-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError('Введите почту и пароль'));
    return;
  }
  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        next(new UnathorizedError('Неправильные почта или пароль'));
      }
      bcrypt.compare(password, user.password);
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  if (!email || !password) {
    throw (new BadRequestError('Введите почту или пароль'));
  }

  User.findOne({ email });
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then((newUser) => {
          res.status(200).send(newUser);
        })
        .catch((err) => {
          if (err.name === 'MongoError' && err.code === 11000) {
            next(new Conflict('Такая почта уже зарегистрирована!'));
          } else if (err.name === 'ValidationError' || err.name === 'CastError') {
            next(new BadRequestError('Переданы некорректные данные'));
          } else {
            next(err);
          }
        });
    });
};

module.exports.getUserInfo = (req, res, next) => {
  const id = req.user._id;
  return User.findById(id)
    .orFail(() => new NotFoundError('Нет пользователя по заданному id'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail(() => new NotFoundError('Нет пользователя по заданному id'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new Conflict('Такая почта уже зарегистрирована!'));
      }
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
