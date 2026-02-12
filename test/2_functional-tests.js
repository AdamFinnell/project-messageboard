const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let testThreadId;
let testReplyId;

suite('Functional Tests', function() {

  suite('Threads', function() {

    test('Create a new thread', function(done) {
      chai.request(server)
        .post('/api/threads/test')
        .send({ text: 'hello', delete_password: 'pass' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.text, 'hello');
          testThreadId = res.body._id;
          done();
        });
    });

    test('View 10 most recent threads', function(done) {
      chai.request(server)
        .get('/api/threads/test')
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });

    test('Report a thread', function(done) {
      chai.request(server)
        .put('/api/threads/test')
        .send({ thread_id: testThreadId })
        .end((err, res) => {
          assert.equal(res.text, 'reported');
          done();
        });
    });

    test('Delete thread with incorrect password', function(done) {
      chai.request(server)
        .delete('/api/threads/test')
        .send({ thread_id: testThreadId, delete_password: 'wrong' })
        .end((err, res) => {
          assert.equal(res.text, 'incorrect password');
          done();
        });
    });
  });

  suite('Replies', function() {

    test('Create a reply', function(done) {
      chai.request(server)
        .post('/api/replies/test')
        .send({
          text: 'reply',
          delete_password: 'pass',
          thread_id: testThreadId
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          testReplyId = res.body.replies[0]._id;
          done();
        });
    });

    test('View single thread with all replies', function(done) {
      chai.request(server)
        .get('/api/replies/test')
        .query({ thread_id: testThreadId })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'replies');
          done();
        });
    });

    test('Report reply', function(done) {
      chai.request(server)
        .put('/api/replies/test')
        .send({
          thread_id: testThreadId,
          reply_id: testReplyId
        })
        .end((err, res) => {
          assert.equal(res.text, 'reported');
          done();
        });
    });

    test('Delete reply with incorrect password', function(done) {
      chai.request(server)
        .delete('/api/replies/test')
        .send({
          thread_id: testThreadId,
          reply_id: testReplyId,
          delete_password: 'wrong'
        })
        .end((err, res) => {
          assert.equal(res.text, 'incorrect password');
          done();
        });
    });

    test('Delete reply with correct password', function(done) {
      chai.request(server)
        .delete('/api/replies/test')
        .send({
          thread_id: testThreadId,
          reply_id: testReplyId,
          delete_password: 'pass'
        })
        .end((err, res) => {
          assert.equal(res.text, 'success');
          done();
        });
    });

  });

});
