import config from 'config';
import 'isomorphic-fetch';

const sendResponseToUser = (recipient, message) => {
  return fetch('https://graph.facebook.com/v3.0/me/messages?access_token=' + config.message_token, {
    headers: {
      'content-type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({
      recipient: { 
        id: recipient
      },
      message: { 
        text: message
      }
     })
  })
  .then(res => res.json())
  .then(response => console.log('Megatron sent message to user\n', response))
  .catch(err => console.error(err));
};

export default sendResponseToUser;