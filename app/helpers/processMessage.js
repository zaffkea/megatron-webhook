import config from 'config';
import "isomorphic-fetch";

const getConversationId = () => {
  return fetch('https://directline.botframework.com/v3/directline/conversations', {
    headers: {
      'Authorization': 'Bearer ' + config.bot_token,
      'content-type': 'application/json'
    },
    method: "POST"
  })
  .then(res => res.json())
  .catch(err => console.error(err))
  .then(response => response);
}

const sendResponse = (recipient, message) => {
  return fetch('https://graph.facebook.com/v2.6/me/messages?access_token=' + config.access_token, {
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
  .catch(err => console.error(err))
  .then(response => console.log('Success:', response));
};

const processMessage = msg => {
  getConversationId()
  .then(conversation => console.log(conversation));
  // sendResponse(msg.sender.id, "you said: " + msg.message.text);
}

export default processMessage;