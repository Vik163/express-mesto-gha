const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

function handleError(err) {
  const ERROR_CODE = 400;
  const ERROR_LOGIN = 401;
  const ERROR_ID = 404;
  const ERROR_EMAIL = 409;
  const ERROR_SERVER = 500;

  if (err.name === 'ValidationError' || err.name === 'CastError' || err === 'errorValid') {
    return {
      status: ERROR_CODE,
      message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля',
    };
  }
  if (err.message === 'Неправильные почта или пароль') {
    return {
      status: ERROR_LOGIN,
      message: err.message,
    };
  }
  if (err === 'error') {
    return {
      status: ERROR_ID,
      message: 'Карточка или пользователь не найден',
    };
  }
  if (err.code === 11000) {
    return {
      status: ERROR_EMAIL,
      message: 'При регистрации указан email, который уже существует на сервере',
    };
  }
  return {
    status: ERROR_SERVER,
    message: 'На сервере произошла ошибка',
  };
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
    .catch((err) => {
      const error = handleError(err);
      next(error);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = `Bearer ${jwt.sign(
        { _id: user._id },
        'secret-key',
        { expiresIn: '7d' },
      )}`;
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.send({ message: 'Всё верно!' });
    })
    .catch((err) => {
      const error = handleError(err);
      next(error);
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      const error = handleError(err);
      next(error);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if ((res.statusCode === 200 && user === null)) {
        const err = 'error';
        throw err;
      }

      res.send(user);
    })
    .catch((err) => {
      const error = handleError(err);
      next(error);
    });
};

module.exports.doesUserExist = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if ((res.statusCode === 200 && user === null)) {
        const err = 'error';
        throw err;
      }

      res.send(user);
    })
    .catch((err) => {
      const error = handleError(err);
      next(error);
    });
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
    .catch((err) => {
      const error = handleError(err);
      next(error);
    });
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
    .catch((err) => {
      const error = handleError(err);
      next(error);
    });
};
