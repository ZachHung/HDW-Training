import { Server } from 'http';
import logger from '../../config/logger';
import { mongooseConnection } from '../../config/mongo';
import { emailQueue } from '../../queues/email.queue';
import emailWorker from '../../queues/email.worker';

export const shutdownGracefully = async (server: Server) => {
  try {
    logger.warn('Closing http server...');
    await emailWorker.close().then(() => logger.warn('Closed worker'));
    await emailQueue.pause().then(() => logger.warn('Paused queue'));
    server.close(() => {
      logger.warn('Http server closed.');
      mongooseConnection.close(false, () => {
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error(`Unable to shut down sever because:\n${error}`);
  }
};
