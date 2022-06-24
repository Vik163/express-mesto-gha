const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(/(https?:\W{2}[www]?\W?([2-domains]|[-?\w+]+)[\Wru]([\W\w{2,}]?)*\W?.+#?)/),
  }),
}), createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    postId: Joi.string().alphanum().length(24),
  }),
}), addLike);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    postId: Joi.string().alphanum().length(24),
  }),
}), deleteLike);

module.exports = router;
