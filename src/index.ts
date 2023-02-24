import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import route from './routes';

import connectMongoDB from './core/config/mongo';
import { errorLogger, requestLogger } from './core/utils/middleware/logger.middleware';
import { errorResponder, invalidPathHandler } from './core/utils/middleware/error.middleware';
import { getEnv } from './core/utils/helpers/get-env';

const app = express();
connectMongoDB();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
route(app);
app.use(errorLogger);
app.use(errorResponder);
app.use(invalidPathHandler);

const port = getEnv('PORT') || 6969;

app.listen(port, async () => {
  console.log('Listening on', port);
});
