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
  .then(response => response)
  .catch(err => err);
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
  startConversation()
  .then(conversation => console.log(conversation))
  .catch(err => console.error(err));
  // sendResponse(msg.sender.id, "you said: " + msg.message.text);
}

export default processMessage;