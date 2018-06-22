import config from 'config';
import likePost from './facebook/likePost';
import processReaction from './processReaction';
const processFeedChange = feed => {
  if(feed.from.id === config.page_id) {
    return console.log('these changes were made by the page:', feed.from.name);
  }
  switch (feed.item) {
    case 'comment':
      likePost(feed.comment_id);
      break;
    case 'post':
      likePost(feed.post_id);
      break;
    case 'reaction':
    case 'like':
      processReaction(feed);
      break;
    default:
      console.log('no logic for processing:', feed.item);
      break;
  }
}

export default processFeedChange;