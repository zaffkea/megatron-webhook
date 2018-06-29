import config from 'config';
import sendMessageToUser from './facebook/sendMessageToUser';

export const message = 'I see you liked our post. Do you have any questions or things I can help you with today?';

const processReaction = reaction => {
  if(!reaction.post_id.includes(config.page_id)){
    return console.log('The post that was liked was not posted by the page.');
  } 
  if(reaction.post_id !== reaction.parent_id){
    return console.log('The post is not the parent post.');
  }
  if(reaction.reaction_type === 'like'){
    return sendMessageToUser(reaction.from.id, message);
  }
}

export default processReaction;