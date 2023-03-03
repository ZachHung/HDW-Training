import * as dotenv from 'dotenv';
dotenv.config();
import express, { Application, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';

import { connectMongoDB } from './core/config/mongo';
import { requestLogger } from './core/utils/middleware/logger.middleware';
import { errorResponder, invalidPathHandler } from './core/utils/middleware/error.middleware';
import { getEnv, shutdownGracefully } from './core/utils/helpers';
import { RegisterRoutes } from './tsoa/routes';
import logger from './core/config/logger';

//import workers
import './core/queues/workers/send-mail.worker';
import './core/queues/workers/check-connection.worker';

import { Server } from 'http';
import { emailQueue } from './core/queues/email.queue';
import { RepeatQueue } from './core/queues/repeat.queue';

export const app: Application = express();
let server: Server;

// connect database
connectMongoDB();

(async () => {
  await RepeatQueue.add('', {}, { repeat: { every: 1000 * 60 * 5 } });
})();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

//  Swagger Doc
app.use('/docs', swaggerUi.serve, async (_req: Request, res: Response) => {
  return res.send(swaggerUi.generateHTML(await import('./tsoa/swagger.json')));
});
RegisterRoutes(app);

app.use(errorResponder);
app.use(invalidPathHandler);

const port = getEnv('PORT') || 6969;

// Resume Queue then start server
emailQueue.resume().then(() => {
  server = app.listen(port, async () => {
    logger.info(`Server is running at port ${port} in ${getEnv('NODE_ENV')} mode`);
    logger.info(`Press CTRL-C to stop`);
  });
});

// Gracefully shutdown
process.on('SIGINT', () => shutdownGracefully(server));
process.on('SIGTERM', () => shutdownGracefully(server));
