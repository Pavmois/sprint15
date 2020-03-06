const Card = require('../models/card');
const Error404 = require('../errors/error404');
const Error401 = require('../errors/error401');
const Error403 = require('../errors/error401');
const Error500 = require('../errors/error500');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))

    .catch(() => next(new Error401('Ошибка при создании карточки')));
};

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(() => next(new Error500('На сервере произошла ошибка')));
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) return next(new Error404('Карточка отсутствует'));
      if (!card.owner.equals(req.user._id)) return next(new Error403('Вы не можете удалять чужие карточки'));

      return Card.remove(card).then((cardToDelete) => res.send(cardToDelete));
    })
    .catch(() => res.status(500).send({ message: 'Карточка отсутствует' }));
};
