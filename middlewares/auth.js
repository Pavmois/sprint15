const jwt = require('jsonwebtoken');
const Error401 = require('../errors/error401');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new Error401('Доступ запрещен. Необходима авторизация');
  }
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    req.user = payload;
  } catch (err) {
    throw new Error401('Доступ запрещен. Необходима авторизация');
  }

  next();
};
