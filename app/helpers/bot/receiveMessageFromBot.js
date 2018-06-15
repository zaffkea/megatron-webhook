import config from 'config';
import sendResponseToUser from '../facebook/sendResponseToUser';

const receiveMessageFromBot = (message, userId) => {
  if(!message) return;
  JSON.parse(message).activities.filter(activity => {
    return activity.type === "message" && activity.from.id === config.bot_id
  }).forEach(activity => {
    console.log('Megatron received message from bot \n', message);
    sendResponseToUser(userId, activity.text);
  });
}

export default receiveMessageFromBot;