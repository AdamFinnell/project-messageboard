'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();

// Security headers FCC REQUIRES
app.use(helmet({
  noSniff: true,
  xssFilter: true,
}));

app.use(helmet.dnsPrefetchControl({ allow: false }));
app.use(helmet.referrerPolicy({ policy: "same-origin" }));

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.DB, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
}).then(() => console.log("DB connected"))
  .catch(err => console.error(err));

// ROUTES
apiRoutes(app);

// FCC TESTING
if (process.env.NODE_ENV === 'tests') {
  console.log('Running in test mode');
  const runner = require('./test-runner');
}

// START SERVER
const listener = app.listen(3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

module.exports = app; // For testing
