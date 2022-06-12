const User = require('../models/user');

function handleError(err, res, req) {
  const ERROR_CODE = 400;
  const ERROR_ID = 404;
  const ERROR_SERVER = 500;
  if (err.name === 'ValidationError' || err === 'errorValid') {
    res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля' });
    return;
  }
  if (err === 'error') {
    res.status(ERROR_ID).send({ message: 'Карточка или пользователь не найден' });
    return;
  }
  res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' });
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => handleError(err, res));
};

module.exports.doesUserExist = (req, res) => {
  User.findOne({ _id: req.params.userId })
    .then((user) => {
      if (res.statusCode === 200 && user === null) {
        const err = 'error';
        throw err;
      }
      if (!(req.user._id === req.params.userId)) {
        const err = 'errorValid';
        throw err;
      }
      res.send(user);
    })
    .catch((err) => handleError(err, res, req));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => handleError(err, res));
};
module.exports.updateUser = (req, res) => {
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
    .catch((err) => handleError(err, res));
};
module.exports.updateUserAvatar = (req, res) => {
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
    .catch((err) => handleError(err, res));
};
