const User = require('../models/user');

function handleError(err, res, req) {
  const ERROR_CODE = 400;
  const ERROR_ID = 404;
  const ERROR_SERVER = 500;
  if (err.name === 'ValidationError' || !(req.user._id === req.params.userId)) {
    res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля' });
    return;
  }
  if (req.user._id === null) {
    res.status(ERROR_ID).send({ message: 'Карточка или пользователь не найден' });
    return;
  }
  res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' });
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => handleError(err, res));
};

module.exports.doesUserExist = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
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
