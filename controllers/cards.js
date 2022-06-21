const Card = require('../models/card');

function handleError(err, req) {
  const ERROR_CODE = 400;
  const ERROR_DELETE_CARD = 403;
  const ERROR_ID = 404;
  const ERROR_SERVER = 500;
  if (err.name === 'ValidationError' || err.name === 'CastError' || err === 'errorValid') {
    return {
      status: ERROR_CODE,
      message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля',
    };
  }
  if (!(req.baseUrl === 'cards')) {
    // res.status(ERROR_ID).send({ message: 'Карточка или пользователь не найден' });
    return {
      status: ERROR_ID,
      message: 'Карточка или пользователь не найден',
    };
  }
  if (err === 'error') {
    // res.status(ERROR_ID).send({ message: 'Карточка или пользователь не найден' });
    return {
      status: ERROR_DELETE_CARD,
      message: 'Попытка удалить чужую карточку',
    };
  }
  return {
    status: ERROR_SERVER,
    message: 'На сервере произошла ошибка',
  };
}

function addError(res, req, card) {
  if ((res.statusCode === 200 && card === null)) {
    const err = 'error';
    throw err;
  }
}

module.exports.getCards = (req, res, next) => {
  Card.find()
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      const error = handleError(err, req);
      next(error);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      const error = handleError(err, req);
      next(error);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findOneAndRemove({ _id: req.params.cardId, owner: req.user._id })
    .populate('owner')
    .then((card) => {
      addError(res, req, card);
      res.send(card);
    })
    .catch((err) => {
      const error = handleError(err, req);
      next(error);
    });
};

module.exports.addLike = (req, res, next) => {
  Card.findOneAndUpdate(
    { _id: req.params.cardId, owner: req.user._id },
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    {
      new: true,
      runValidators: true,
    },
  )
    .then((card) => {
      addError(res, req, card);
      res.send(card);
    })
    .catch((err) => {
      const error = handleError(err, req);
      next(error);
    });
};

module.exports.deleteLike = (req, res, next) => {
  Card.findOneAndUpdate(
    { _id: req.params.cardId, owner: req.user._id },
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    {
      new: true,
      runValidators: true,
    },
  )
    .then((card) => {
      addError(res, req, card);
      res.send(card);
    })
    .catch((err) => {
      const error = handleError(err, req);
      next(error);
    });
};
