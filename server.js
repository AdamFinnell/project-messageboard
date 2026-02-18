'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();

// === SECURITY HEADERS FCC REQUIRES ===
// app.use(helmet({ noSniff: true, xssFilter: true }));
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');        // iframe restriction
  res.setHeader('X-DNS-Prefetch-Control', 'off');        // disable DNS prefetching
  res.setHeader('Referrer-Policy', 'same-origin');       // only send referrer to own pages
  res.setHeader('X-Content-Type-Options', 'nosniff');    // no sniff
  res.setHeader('X-XSS-Protection', '1; mode=block');    // xss filter
  next();
});


// CORS
app.use(cors({ origin: '*' }));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(__dirname + '/public'));

// === MONGOOSE / MONGO CONNECTION ===
mongoose.connect(process.env.DB)
  .then(() => console.log("DB connected"))
  .catch(err => console.error(err));

// === ROUTES ===
apiRoutes(app);

// === FCC TEST RUNNER ===
if (process.env.NODE_ENV === 'tests') {
  console.log('Running in test mode');
  const runner = require('./test-runner');
}

// === START SERVER ===
const listener = app.listen(3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

module.exports = app; 
