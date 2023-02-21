import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import route from './routes';

import connect from './core/config/mongo.js';
import { errorLogger, requestLogger } from './core/utils/middleware/logger.middleware';
import {
  errorResponder,
  invalidPathHandler,
} from './core/utils/middleware/error.middleware';
import { getEnv } from './core/utils/helpers/get-env';

const app = express();
connect();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(requestLogger);
route(app);
app.use(errorLogger);
app.use(errorResponder);
app.use(invalidPathHandler);

const port = getEnv('PORT') || 6969;

app.listen(port, async () => {
  console.log('Listening on', port);
});
