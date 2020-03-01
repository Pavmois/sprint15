const jwt = require('jsonwebtoken');
const error401 = require('../errors/error401');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    // eslint-disable-next-line new-cap
    throw new error401('Доступ запрещен. Необходима авторизация');
  }
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    req.user = payload;
  } catch (err) {
    // eslint-disable-next-line new-cap
    throw new error401('Доступ запрещен. Необходима авторизация');
  }

  next();
};
