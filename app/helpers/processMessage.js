
import 'isomorphic-fetch';
import WebSocket from 'ws';
import startConversation from './bot/startConversation';
import endConversation from './bot/endConversation';
import sendMessageToBot from './bot/sendMessageToBot';
import receiveMessageFromBot from './bot/receiveMessageFromBot';

const conversations = {};

const removeConversation = userId => {
  console.log('Megatron removed conversation for user:', userId);
  delete conversations[userId];
}

const processMessage = userMsg => {
  const conversation = conversations[userMsg.sender.id];
  if(conversation){
    return sendMessageToBot(conversation, userMsg);
  }
  return startConversation()
  .then(conversation => {
    const ws = new WebSocket(conversation.streamUrl);
    conversation['websocket'] = ws;
    ws.on('message', botMsg => receiveMessageFromBot(botMsg, userMsg.sender.id));
    ws.on('endOfConversation', () => removeConversation(userMsg.sender.id));
    ws.on('close', () => removeConversation(userMsg.sender.id));
    setTimeout(() => {
      removeConversation(userMsg.sender.id);
      endConversation(conversation.conversationId, userMsg.sender.id);
    }, conversation.expires_in * 1000);
    conversations[userMsg.sender.id] = conversation;
    return sendMessageToBot(conversation, userMsg);
  })
  .catch(err => console.error(err));
}

export default processMessage;