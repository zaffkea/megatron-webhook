import chai from 'chai';
import chaiHttp from 'chai-http';
const should = chai.should();

import server from '../app/server';

chai.use(chaiHttp);

describe('server.js', () => {
  it('GET status 200', (done) => {
    chai.request(server)
    .get('/')
    .end((err, res) => {
      res.should.have.status(200);
      done();
    });
  });
  it('GET status 404', (done) => {
    chai.request(server)
    .get('/give-me-a-404')
    .end((err, res) => {
      res.should.have.status(404);
      done();
    });
  });
});