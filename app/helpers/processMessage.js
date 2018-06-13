import config from 'config';
import "isomorphic-fetch";
const processMessage = msg => {
  console.log(msg);
  fetch('https://graph.facebook.com/v2.6/me/messages?access_token=' + config.access_token, {
    headers: {
      'content-type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({
      recipient: { 
        id: msg.sender.id
      },
      message: { 
        text: "you said: " + msg.message.text
      }
     })
  })
  .then(res => res.json())
  .catch(err => console.error(err))
  .then(response => console.log('Success:', response));
}

export default processMessage;