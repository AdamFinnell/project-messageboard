'use strict';

const Thread = require('../models/Thread');
const mongoose = require('mongoose');

module.exports = function (app) {

  // POST THREAD
  app.route('/api/threads/:board')
    .post(async (req, res) => {
      const { text, delete_password } = req.body;
      const board = req.params.board;

      const thread = new Thread({
        board,
        text,
        delete_password
      });

      await thread.save();
      res.json(thread);
    })

    // GET THREADS (10 threads, 3 replies)
    .get(async (req, res) => {
      const board = req.params.board;

      const threads = await Thread.find({ board })
        .sort({ bumped_on: -1 })
        .limit(10)
        .lean();

      threads.forEach(t => {
        delete t.delete_password;
        delete t.reported;
        if (t.replies.length > 3) {
          t.replies = t.replies.slice(-3);
        }
        t.replies.forEach(r => {
          delete r.delete_password;
          delete r.reported;
        });
      });

      res.json(threads);
    })

    // DELETE THREAD
    .delete(async (req, res) => {
      const { thread_id, delete_password } = req.body;

      const thread = await Thread.findById(thread_id);
      if (!thread) return res.send('incorrect password');

      if (thread.delete_password !== delete_password)
        return res.send('incorrect password');

      await thread.deleteOne();
      res.send('success');
    })

    // REPORT THREAD
    .put(async (req, res) => {
      const { thread_id } = req.body;

      await Thread.findByIdAndUpdate(thread_id, { reported: true });
      res.send('reported');
    });

  // =========== REPLIES ===============

  app.route('/api/replies/:board')
    // POST REPLY
    .post(async (req, res) => {
      const { text, delete_password, thread_id } = req.body;

      const reply = {
        _id: new mongoose.Types.ObjectId(),
        text,
        delete_password
      };

      const thread = await Thread.findById(thread_id);
      thread.replies.push(reply);
      thread.bumped_on = new Date();
      await thread.save();

      res.json(thread);
    })

    // GET FULL THREAD W/ ALL REPLIES
    .get(async (req, res) => {
      const { thread_id } = req.query;

      const thread = await Thread.findById(thread_id).lean();

      delete thread.delete_password;
      delete thread.reported;

      thread.replies.forEach(r => {
        delete r.delete_password;
        delete r.reported;
      });

      res.json(thread);
    })

    // DELETE REPLY (set text to "[deleted]")
    .delete(async (req, res) => {
      const { thread_id, reply_id, delete_password } = req.body;

      const thread = await Thread.findById(thread_id);
      const reply = thread.replies.id(reply_id);

      if (!reply || reply.delete_password !== delete_password)
        return res.send('incorrect password');

      reply.text = '[deleted]';
      await thread.save();
      res.send('success');
    })

    // REPORT REPLY
    .put(async (req, res) => {
      const { thread_id, reply_id } = req.body;

      const thread = await Thread.findById(thread_id);
      const reply = thread.replies.id(reply_id);

      reply.reported = true;
      await thread.save();

      res.send('reported');
    });
};
