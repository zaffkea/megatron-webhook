import chai from 'chai';
import sinon from 'sinon';
import WebSocket from 'ws';

import * as processMessage from '../../app/helpers/processMessage';
import * as startConversation from '../../app/helpers/bot/startConversation';
import * as receiveMessageFromBot from '../../app/helpers/bot/receiveMessageFromBot';
import * as sendMessageToBot from '../../app/helpers/bot/sendMessageToBot';

import message from '../mock_data/message.json';
import conversation from '../mock_data/conversation.json';

const expect = chai.expect;
const userMsg = message.entry[0].messaging[0];

let server;
let socket;

describe('processMessage.js', () => {

  before(() => {
    conversation.streamUrl = 'ws://127.0.0.1:3002';
    sinon.stub(startConversation, 'default')
      .onFirstCall().returns(Promise.resolve(conversation))
      .onSecondCall().returns(Promise.resolve(conversation))
      .onThirdCall().returns(Promise.reject('error starting conversation'))
    sinon.stub(sendMessageToBot, 'default');
    sinon.stub(receiveMessageFromBot, 'default');
    sinon.stub(console, 'error');
  });
  
  it('starts a new conversation with a bot', (done) => {
    server = new WebSocket.Server({ port: 3002 });
    server.on('connection', function (ws) {
      socket = ws;
      socket.send('bot message 1');
      setTimeout(() => {
        expect(startConversation.default.called).to.be.true;
        expect(receiveMessageFromBot.default.calledWith('bot message 1', userMsg.sender.id)).to.be.true;
        expect(sendMessageToBot.default.calledWith(Object.values(processMessage.conversations)[0], userMsg)).to.be.true;
        expect(Object.keys(processMessage.conversations).length).to.equal(1);
        done();
      }, 10);
    });
    processMessage.default(userMsg);
    
  });

  it('continues a conversation with a bot', (done) => {
    const userMsg2 = JSON.parse(JSON.stringify(userMsg));
    userMsg2.message.text = 'message 2';
    processMessage.default(userMsg2);
    expect(sendMessageToBot.default.calledWith(Object.values(processMessage.conversations)[0], userMsg2)).to.be.true;
      done();
  });

  it('clears out the conversation when the web socket closes', (done) => {
    socket.on('close', () => {
      setTimeout(() => {
        expect(Object.keys(processMessage.conversations).length).to.equal(0);
        server.close();
        done();
      }, 10);
    });
    socket.close();
  });

  it('clears out the conversation after the token times out', (done) => {
    let clock = sinon.useFakeTimers();
    server = new WebSocket.Server({ port: 3002 });
    server.on('connection', function (ws) {
      setTimeout(() => {
        expect(Object.keys(processMessage.conversations).length).to.equal(1);
        clock.tick(conversation.expires_in * 1000);
        expect(Object.keys(processMessage.conversations).length).to.equal(0);
        clock.restore();
        socket.close();
        server.close();
        done();
      }, 10);
      clock.tick(10);
    });
    processMessage.default(userMsg);
  });

  it('logs error if conversation is not started', (done) => {
    processMessage.default(userMsg);
    setTimeout(() => {
      expect(console.error.calledWith('error starting conversation')).to.be.true;
      done();
    }, 10);
    
  });

  after(() => {
    sendMessageToBot.default.restore();
    receiveMessageFromBot.default.restore();
    startConversation.default.restore();
    console.error.restore();
  });

});