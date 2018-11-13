const express = require('express');
const { body, param } = require('express-validator/check');

const feedController = require('../controllers/feed');

const router = express.Router();

router.put('/signup');

module.exports = router;
