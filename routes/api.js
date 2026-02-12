const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Assuming you have a Thread and Reply model defined
const Thread = require('../models/Thread'); // Adjust path
const Reply = require('../models/Reply'); // Adjust path

// Create a new thread
router.post('/threads/:board', async (req, res) => {
  try {
    const { text, delete_password } = req.body;
    const newThread = new Thread({
      text: text,
      delete_password: delete_password,
      board: req.params.board,
      _id: new mongoose.mongo.BSON.ObjectId() // Generate a unique ID
    });
    await newThread.save();
    res.status(200).json(newThread);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create thread' });
  }
});

// Get all threads for a board
router.get('/threads/:board', async (req, res) => {
    try {
        const threads = await Thread.find({ board: req.params.board }).limit(10);
        res.status(200).json({ threads });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get threads' });
    }
});

// Delete a thread
router.delete('/threads/:id', async (req, res) => {
  try {
    const threadId = req.params.id;
    const thread = await Thread.findById(threadId);

    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    if (thread.delete_password !== req.body.delete_password) {
      return res.status(401).json({ error: 'incorrect password' });
    }

    await thread.remove();
    res.status(200).json({ message: 'Thread deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete thread' });
  }
});


// Create a new reply
router.post('/replies/:board', async (req, res) => {
  try {
    const { text, delete_password } = req.body;
    const newReply = new Reply({
      text: text,
      delete_password: delete_password,
      thread_id: req.params.board, // Board is now the thread_id
      _id: new mongoose.mongo.BSON.ObjectId()
    });
    await newReply.save();
    res.status(200).json(newReply);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create reply' });
  }
});

module.exports = router;
