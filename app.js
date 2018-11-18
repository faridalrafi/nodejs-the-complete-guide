require('dotenv').config();
const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const config = require('./config/cors');
const errorHandler = require('./config/error');
const multerConfig = require('./config/multer');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();

const acessLogStream = fs.createWriteStream(path.join(__dirname, 'acess.log'), {
  flags: 'a',
});

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: acessLogStream }));

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

app.use(errorHandler.error);

const bootstrap = async () => {
  try {
    const mongoDB = await mongoose.connect(
      process.env.DB_HOST,
      { useNewUrlParser: true },
    );
    const server = await app.listen(parseInt(process.env.PORT, 10) || 3000);
    const io = require('./config/socket').init(server);
    io.on('connection', (socket) => {
      console.log('Client connected');
    });
  } catch (err) {
    console.log(err);
  }
};

bootstrap();
