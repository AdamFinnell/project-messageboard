const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // Import body-parser
const apiRoutes = require('./routes/api.js'); // Adjust path

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies

// Connect to MongoDB
mongoose.connect('mongodb://localhost/messageboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Use the API routes
app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
