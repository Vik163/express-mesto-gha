const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const cookieParser = require('cookie-parser');
const auth = require('../middlewares/auth');

const {
  getUsers,
  doesUserExist,
  getCurrentUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

router.use(cookieParser());
router.get('/', auth, getUsers);
router.get('/me', auth, getCurrentUser);
router.get('/:userId', auth, doesUserExist);
router.patch('/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);
router.patch('/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.link().required(),
  }),
}), updateUserAvatar);

module.exports = router;
