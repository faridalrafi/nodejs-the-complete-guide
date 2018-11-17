require('dotenv').config();
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const config = require('./config/cors');
const errorHandler = require('./config/error');
const multerConfig = require('./config/multer');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(
  multer({
    storage: multerConfig.fileStorage,
    fileFilter: multerConfig.fileFilter,
  }).single('image'),
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(config.cors);

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    process.env.DB_HOST,
    { useNewUrlParser: true },
  )
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
