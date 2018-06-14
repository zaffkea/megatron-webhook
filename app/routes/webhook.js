import express from 'express';
import config from 'config';
import processMessage from '../helpers/processMessage';
const router = express.Router();

router.get('/', (req, res) => {
  console.log(JSON.stringify(req.query));
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
  console.log(JSON.stringify(req.body));
  if (body.object === 'page') {
    body.entry.forEach(entry => {
      if(entry.messaging && entry.messaging[0]){
        // processMessage(entry.messaging[0]);
      }
      if(entry.changes && entry.changes[0]){
        // process the update
      }
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

export default router;