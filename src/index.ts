import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import route from './routes/';
import {
  errorLogger,
  errorResponder,
  getEnv,
  invalidPathHandler,
  requestLogger,
} from './helpers.js';
import connect from './config/mongo.js';

const app = express();
connect();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
route(app);
app.use(requestLogger);
app.use(errorLogger);
app.use(errorResponder);
app.use(invalidPathHandler);

const port = getEnv('PORT') || 6969;

app.listen(port, async () => {
  console.log('Listening on', port);
});
