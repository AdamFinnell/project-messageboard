const chaiHttp = require('chai-http');
const chai = require('chai');
const server = require('../server.js');
const apiRoutes = require('../routes/api.js');


chai.use(chaiHttp);

describe('Threads', () => {
    let threadId;

    beforeEach(async () => {
        // Reset test data before each test
        threadId = null;
    });

    it('should create a new thread', async () => {
        const payload = {
            text: 'Test Thread',
            delete_password: 'password'
        };

        const response = await chaiHttp.post('/api/threads/testboard')
            .send(payload)
            .expect(200);

        assert.isNotNull(response.body);
        assert.isDefined(response.body._id);
        threadId = response.body._id;
        assert.equal(response.status, 200);
    });

    it('should view the 10 most recent threads', async () => {
        const response = await chaiHttp.get('/api/threads/testboard')
            .expect(200);

        assert.isNotNull(response.body);
        assert.isArray(response.body.threads);
        assert.isNumber(response.body.threads[0]._id);
    });

    it('should delete a thread with correct password', async () => {
        // You'll need to implement the deleteThread route
        const response = await chaiHttp.delete(`/api/threads/${threadId}`)
            .expect(200);
        assert.equal(response.body.message, 'Thread deleted');

    });
});
