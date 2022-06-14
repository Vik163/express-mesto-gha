const express = require('express');
const bodyParser = require('body-parser');
const process = require('process');

const { PORT = 3000 } = process.env;

const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '62a8bfe2e91a41f839d3d0b4',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  const ERROR_CODE = 404;
  Promise.reject(new Error('Ошибка'))
    .catch(() => res.status(ERROR_CODE).send({ message: 'Некорректный путь' }));
});

app.listen(PORT, () => {
});
