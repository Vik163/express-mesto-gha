const express = require('express');
const bodyParser = require('body-parser');
const process = require('process');

const { PORT = 3000 } = process.env;

const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');

const app = express();

const cookieParser = require('cookie-parser');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/users/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.link(),
  }),
}), createUser);
app.post('/users/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login);
app.use(cookieParser());
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  const ERROR_CODE = 404;
  Promise.reject(new Error('Ошибка'))
    .catch(() => res.status(ERROR_CODE).send({ message: 'Некорректный путь' }));
});

app.use(errors());

app.use((err, req, res, next) => {
  res.status(err.status).send({ message: err.message });

  next();
});

app.listen(PORT, () => {
});
