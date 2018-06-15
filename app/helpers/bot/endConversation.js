import config from 'config';
import "isomorphic-fetch";

const endConversation = (conversationId, userId) => {
  const body = {
    type: 'endOfConversation',
    from: {
      id: userId
    }
  }
  return fetch('https://directline.botframework.com/v3/directline/conversations/' + conversationId + '/activities', {
    headers: {
      'Authorization': 'Bearer ' + config.bot_token,
      'content-type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify(body)
  })
  .then(res => res.json())
  .then(response => console.log('Megatron ended conversation\n', response))
  .catch(err => err);
}

export default endConversation;