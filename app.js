require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const { router } = require('./routes');
const errorHandler = require('./middlwares/error-handler');
const { requestLogger, errorLogger } = require('./middlwares/logger');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/diplomadb' } = process.env;

const app = express();

app.use(bodyParser.json());

app.use(requestLogger);
app.use(cors());
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  autoIndex: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
