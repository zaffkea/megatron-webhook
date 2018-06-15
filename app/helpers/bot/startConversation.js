import config from 'config';
import "isomorphic-fetch";

const startConversation = () => {
  return fetch('https://directline.botframework.com/v3/directline/conversations', {
    headers: {
      'Authorization': 'Bearer ' + config.bot_token,
      'content-type': 'application/json'
    },
    method: "POST"
  })
  .then(res => res.json())
  .then(response => {
    console.log('Megatron started conversation\n', response)
    return response;
  })
  .catch(err => err);
}

export default startConversation;