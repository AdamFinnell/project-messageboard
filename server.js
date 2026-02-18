'use strict';

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();

// === FCC REQUIRED SECURITY HEADERS (Render + FCC test tweak) ===
app.use((req, res, next) => {
  const fccTestOrigin = 'https://www.freecodecamp.org'; // FCC test origin

  // X-Frame-Options
  if (req.headers.origin === fccTestOrigin) {
    res.setHeader('X-Frame-Options', 'ALLOW-FROM ' + fccTestOrigin);
  } else {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN'); // normal security
  }

  // DNS prefetch control
  res.setHeader('X-DNS-Prefetch-Control', 'off');

  // Referrer policy
  res.setHeader('Referrer-Policy', 'same-origin');

  // Extra security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');

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
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

module.exports = app;
