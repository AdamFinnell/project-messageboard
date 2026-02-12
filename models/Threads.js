// models/Thread.js
const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema({
  text: String,
  delete_password: String,
  board: String,
  _id: mongoose.mongo.BSON.ObjectId
});

module.exports = mongoose.model('Thread', threadSchema);
