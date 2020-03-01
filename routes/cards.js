const cards = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  createCard, getAllCards, deleteCard,
} = require('../controllers/cards');

cards.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2),
    link: Joi.string().required(),
  }),
}), createCard);
cards.get('/', getAllCards);
cards.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);

module.exports = cards;
