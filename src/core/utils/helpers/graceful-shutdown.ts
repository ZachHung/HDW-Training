import { Server } from 'http';
import logger from '../../config/logger';
import { mongooseConnection } from '../../config/mongo';
import { emailQueue } from '../../queues/email.queue';
import { RepeatQueue } from '../../queues/repeat.queue';
import checkConnectionWorker from '../../queues/workers/check-connection.worker';
import emailWorker from '../../queues/workers/send-mail.worker';

export const shutdownGracefully = async (server: Server) => {
  try {
    logger.warn('Closing http server...');
    await emailWorker.close();
    await checkConnectionWorker.close();
    logger.warn('Closed worker');
    await emailQueue.pause();
    await RepeatQueue.drain(true);
    logger.warn('Paused queue');
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
