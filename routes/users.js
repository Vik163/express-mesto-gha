const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  doesUserExist,
  getCurrentUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', doesUserExist);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.link(),
  }),
}), updateUserAvatar);

module.exports = router;
