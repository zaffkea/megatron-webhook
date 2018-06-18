import config from 'config';
import likePost from './facebook/likePost';
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
      console.log('it is a like');
      break;
    default:
      console.log('no logic for processing:', feed.item);
  }
}

export default processFeedChange;