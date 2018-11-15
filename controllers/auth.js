const { body, param } = require('express-validator/check');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const { email, name, password } = req.body;

  bcrypt
    .hash(password, 12)
    .then((hashPw) => {
      const user = new User({ email, password: hashPw, name });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: 'user created', userId: result._id });
    })
    .catch((err) => {
      const errorToSend = err;
      if (!errorToSend.statusCode) errorToSend.statusCode = 500;
      errorToSend.message = err.message;
      next(errorToSend);
    });
};
