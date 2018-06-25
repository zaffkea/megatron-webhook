import chai from 'chai';
import sinon from 'sinon';
import config from 'config';

const expect = chai.expect;

import processFeedChange from '../../app/helpers/processFeedChange';
import * as likePost from '../../app/helpers/facebook/likePost';
import * as processReaction from '../../app/helpers/processReaction';

import comment from '../mock_data/comment.json';
import post from '../mock_data/post.json';
import reactionLike from '../mock_data/reactionLike.json';

describe('processFeedChange.js', () => {

  beforeEach(() => {
    sinon.spy(console, 'log');
    sinon.stub(likePost, 'default');
    sinon.stub(processReaction, 'default');
  });
  
  it('returns right away if the feed change is from the page', (done) => {
    const pgComment = JSON.parse(JSON.stringify(comment.entry[0].changes[0].value));
    pgComment.from.id = config.page_id;
    pgComment.from.name = '<PAGE_NAME>';
    processFeedChange(pgComment);
    expect(console.log.calledOnce).to.be.true;
    expect(console.log.calledWith('these changes were made by the page:', pgComment.from.name)).to.be.true;
    done();
  });

  it('likes a comment', (done) => {
    const usrComment = comment.entry[0].changes[0].value;
    processFeedChange(usrComment);
    expect(likePost.default.calledOnce).to.be.true;
    expect(likePost.default.calledWith(usrComment.comment_id)).to.be.true;
    expect(console.log.calledOnce).to.be.false;
    done();
  });

  it('likes a post', (done) => {
    const usrPost = post.entry[0].changes[0].value;
    processFeedChange(usrPost);
    expect(likePost.default.calledOnce).to.be.true;
    expect(likePost.default.calledWith(usrPost.post_id)).to.be.true;
    expect(console.log.calledOnce).to.be.false;
    done();
  });

  it('processes a reaction', (done) => {
    const usrReaction = reactionLike.entry[0].changes[0].value;
    processFeedChange(usrReaction);
    expect(processReaction.default.calledOnce).to.be.true;
    expect(processReaction.default.calledWith(usrReaction)).to.be.true;
    expect(console.log.calledOnce).to.be.false;
    done();
  });

  it('logs the feed change if no logic exists for it', (done) => {
    const feedChange = JSON.parse(JSON.stringify(comment.entry[0].changes[0].value));
    feedChange.item = 'trigger_default';
    processFeedChange(feedChange);
    expect(console.log.calledOnce).to.be.true;
    expect(console.log.calledWith('no logic for processing:', feedChange.item)).to.be.true;
    done();
  });

  afterEach(() => {
    console.log.restore();
    likePost.default.restore();
    processReaction.default.restore();
  });

});