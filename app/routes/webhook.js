import express from 'express';
import config from 'config';
import processMessage from '../helpers/processMessage';
import processFeedChange from '../helpers/processFeedChange';
const router = express.Router();

router.get('/', (req, res) => {
  console.log('Megatron recieved GET request\n', JSON.stringify(req.query));
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === config.verify_token) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);      
  }
});

router.post('/', (req, res) => {
  const body = req.body;
  console.log('Megatron recieved POST request\n', JSON.stringify(req.body));
  if (body.object === 'page') {
    body.entry.forEach(entry => {
      // check if it's a message
      if(entry.messaging && entry.messaging[0]){
        processMessage(entry.messaging[0]);
      }
      // check if it's a feed change
      if(entry.changes && entry.changes[0] && entry.changes[0].field === 'feed' && entry.changes[0].value.verb === 'add'){
        processFeedChange(entry.changes[0].value);
      }
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

export default router;