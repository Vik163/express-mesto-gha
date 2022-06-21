const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authorization = req.cookies.jwt;
  const loginError = {
    status: 401,
    message: 'Неправильные почта или пароль',
  };

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw loginError;
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    next(loginError);
  }

  req.user = payload;

  next();
};
