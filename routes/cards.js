const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const cookieParser = require('cookie-parser');
const auth = require('../middlewares/auth');

const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');
router.use(cookieParser());

router.get('/', auth, getCards);
router.post('/', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.link().required(),
  }),
}), createCard);
router.delete('/:cardId', auth, deleteCard);
router.put('/:cardId/likes', auth, addLike);
router.delete('/:cardId/likes', auth, deleteLike);

module.exports = router;
