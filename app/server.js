import express from 'express';
import bodyParser from 'body-parser';
import config from 'config';

const app = express();

//routes
import webhook from './routes/webhook';


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Webhook server');
});

app.use('/webhook', webhook);

app.get('*', (req, res) => {
  res.status(404).send('404 :(');
});

app.listen(config.port, () => console.log(`Webhook server is listening on port: ${config.port}`));


export default app;