const express = require('express');
const { body } = require('express-validator/check');

const User = require('../models/user');

const authontroller = require('../controllers/auth');

const router = express.Router();

router.put(
  '/signup',
  [
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty()
      .isLength({ min: 5 }),
    body('email')
      .isEmail()
      .withMessage('Please, enter a valid email')
      .custom((value, { req }) => {
        User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-mail already exists');
          }
        });
      })
      .normalizeEmail(),
  ],
  authontroller.signup,
);

module.exports = router;
