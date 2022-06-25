const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

function addError(res, user) {
  if ((res.statusCode === 200 && !user)) {
    const err = 'error';
    throw err;
  }
}

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => next(err));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'secret-key',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.send({ message: 'Всё верно!' });
    })
    .catch((err) => next(err));
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => next(err));
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      addError(res, user);

      res.send(user);
    })
    .catch((err) => next(err));
};

module.exports.doesUserExist = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      addError(res, user);

      res.send(user);
    })
    .catch((err) => next(err));
};

module.exports.updateUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about, avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
};
module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
};
