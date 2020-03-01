/* eslint-disable no-shadow */
require('dotenv').config();
const express = require('express');
const cookie = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Error404 = require('../errors/error404');
const Error401 = require('../errors/error401');
const Error403 = require('../errors/error401');


const app = express();
app.use(cookie());

// eslint-disable-next-line consistent-return
module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))

    .then(({
      name,
      about,
      avatar,
      email,
    }) => res.send({
      name,
      about,
      avatar,
      email,
    }))
    // eslint-disable-next-line no-undef
    .catch(() => next(new Error403('Неверно ввели данные')));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.cookie('token', token);
      res.status(200).send({ token });
    })
    .catch(() => {
      // eslint-disable-next-line no-undef
      next(new Error401('Неправильный логин или пароль'));
    });
};

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .populate('user')
    .then((users) => res.send({ data: users }))
    // eslint-disable-next-line no-undef
    .catch(() => next(new Error404('Произошла ошибка при поиске всех пользователей')));
};

module.exports.getSingleUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    // eslint-disable-next-line no-undef
    .catch(() => next(new Error404('Нет пользователя с таким id')));
};
