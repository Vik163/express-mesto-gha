const Card = require('../models/card');

function handleError(err, res) {
  const ERROR_CODE = 400;
  const ERROR_ID = 404;
  const ERROR_SERVER = 500;
  if (err.name === 'ValidationError') {
    res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля' });
    return;
  }
  if (err.name === 'CastError') {
    res.status(ERROR_ID).send({ message: 'Карточка или пользователь не найден' });
    return;
  }
  res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' });
}

module.exports.getCards = (req, res) => {
  Card.find()
    .then((cards) => res.send({ data: cards }))
    .catch((err) => handleError(err, res));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => handleError(err, res));
};

module.exports.deleteCard = (req, res) => {
  Card.deleteMany({ owner: req.params.cardId })
    .then((card) => res.send({ data: card }))
    .catch((err) => handleError(err, res));
};

module.exports.addLike = (req, res) => {
  Card.findOneAndUpdate(
    { owner: req.params.cardId },
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    {
      new: true,
      runValidators: true,
    },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => handleError(err, res));
};

module.exports.deleteLike = (req, res) => {
  Card.findOneAndUpdate(
    { owner: req.params.cardId },
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    {
      new: true,
      runValidators: true,
    },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => handleError(err, res));
};
