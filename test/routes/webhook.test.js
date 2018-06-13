import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../app/server';
import config from 'config';

const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

describe('webhook.js', () => {
  it('GET returns status 403 with no query params', (done) => {
    chai.request(server)
    .get('/webhook')
    .end((err, res) => {
      res.should.have.status(403);
      done();
    });
  });

  it('GET returns challenge response', (done) => {
    chai.request(server)
    .get('/webhook')
    .query({
      'hub.mode': 'subscribe',
      'hub.verify_token': config.verify_token,
      'hub.challenge': 'test-challenge'
    })
    .end((err, res) => {
      res.should.have.status(200);
      res.text.should.equal('test-challenge');
      done();
    });
  });

  it('POST returns 404 when object !== page', (done) => {
    chai.request(server)
    .post('/webhook')
    .send({
      object: 'not-a-page'
    })
    .end((err, res) => {
      res.should.have.status(404);
      done();
    });
  });

  it('POST returns status 200', (done) => {
    chai.request(server)
    .post('/webhook')
    .send({
      object: 'page',
      entry: [
        {
          id:'<PAGE_ID>',
          time: Date.now(),
          messaging: [
            {
              sender: {
                id:"<PSID>"
              },
              recipient: {
                id: "<PAGE_ID>"
              }
            }
          ]
        }
      ]
    })
    .end((err, res) => {
      res.should.have.status(200);
      done();
    });
  });

});