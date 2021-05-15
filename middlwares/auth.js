const jwt = require('jsonwebtoken');
const UnathorizedError = require('../errors/unathorized-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    if (!authorization) {
      next(new UnathorizedError('Необходима авторизация'));
    }
    const token = authorization.replace('Bearer ', '');
    const payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    req.user = payload;
    next();
  } catch (err) {
    next(new UnathorizedError('Необходима авторизация'));
  }
};
