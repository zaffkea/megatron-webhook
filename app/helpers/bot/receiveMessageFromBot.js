import config from 'config';
import sendMessageToUser from '../facebook/sendMessageToUser';

const receiveMessageFromBot = (message, userId) => {
  if(!message) return;
  JSON.parse(message).activities.filter(activity => {
    return activity.type === "message" && activity.from.id === config.bot_id
  }).forEach(activity => {
    console.log('Megatron received message from bot \n', message);
    sendMessageToUser(userId, activity.text);
  });
}

export default receiveMessageFromBot;