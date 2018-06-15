import 'isomorphic-fetch';

const sendMessageToBot = (conversation, msg) => {
  const body = {
    type: 'message',
    from: {
      id: msg.sender.id
    },
    text: msg.message.text
  }
  return fetch('https://directline.botframework.com/v3/directline/conversations/' + conversation.conversationId + '/activities', {
    headers: {
      'Authorization': 'Bearer ' + conversation.token,
      'content-type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify(body)
  })
  .then(res => res.json())
  .then(response => console.log('Megatron sent message to bot\n', response))
  .catch(err => err);
}

export default sendMessageToBot;