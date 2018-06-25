import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../app/server';
import config from 'config';
import sinon from 'sinon';
import * as processMessage from '../../app/helpers/processMessage';
import * as processFeedChange from '../../app/helpers/processFeedChange';

import message from '../mock_data/message.json';
import reactionLike from '../mock_data/reactionLike.json';

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

  it('receives message from user and returns status 200', (done) => {
    sinon.stub(processMessage, 'default').returns(Promise.resolve({}));
    chai.request(server)
    .post('/webhook')
    .send(message)
    .end((err, res) => {
      res.should.have.status(200);
      res.text.should.equal('EVENT_RECEIVED');
      done();
    });
  });

  it('receives feed change and returns status 200', (done) => {
    sinon.stub(processFeedChange, 'default').returns(Promise.resolve({}));
    chai.request(server)
      .post('/webhook')
      .send(reactionLike)
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.equal('EVENT_RECEIVED');
        done();
      });
  });

});