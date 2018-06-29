import chai from 'chai';
import sinon from 'sinon';

import * as processReaction from '../../app/helpers/processReaction';
import * as sendMessageToUser from '../../app/helpers/facebook/sendMessageToUser';
import reactionLike from '../mock_data/reactionLike.json';

const reaction = reactionLike.entry[0].changes[0].value;
const expect = chai.expect;

describe('processReaction.js', () => {

  before(() => {
    sinon.spy(console, 'log');
    sinon.stub(sendMessageToUser, 'default');
  });

  it('logs if the post was not the parent post', (done) => {
    processReaction.default(reaction);
    expect(console.log.calledWith('The post is not the parent post.')).to.be.true;
    done();
  });

  it('sends a message to a user after they like one of the page\'s posts', (done) => {
    reaction.post_id = reaction.parent_id;
    processReaction.default(reaction);
    console.log(processReaction.message);
    expect(sendMessageToUser.default.calledWith(reaction.from.id, processReaction.message)).to.be.true;
    done();
  });

  it('does nothing if the reaction is anything other than a like', (done) => {
    reaction.reaction_type = '<NOT_A_LIKE>';
    processReaction.default(reaction);
    done();
  });

  it('logs if the reaction was on a post that was not from the page', (done) => {
    reaction.post_id = '<SOME_RANDOM_USER>';
    processReaction.default(reaction);
    expect(console.log.calledWith('The post that was liked was not posted by the page.')).to.be.true;
    done();
  });

  after(() => {
    console.log.restore();
    sendMessageToUser.default.restore();
  });

});