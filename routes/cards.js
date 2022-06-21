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
  headers: Joi.object().keys({
  }),
  query: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.link(),
  }),
}), createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', addLike);
router.delete('/:cardId/likes', deleteLike);

module.exports = router;
