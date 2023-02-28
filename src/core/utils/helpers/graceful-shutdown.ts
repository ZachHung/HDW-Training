import { Server } from 'http';
import mongoose from 'mongoose';
import logger from '../../config/logger';

const shutdownGracefully = (server: Server) => {
  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received.');
    logger.info('Closing http server...');
    server.close(() => {
      logger.info('Http server closed.');
      mongoose.connection.close(false, () => {
        process.exit(0);
      });
    });
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT signal received.');
    logger.info('Closing http server...');
    server.close(() => {
      logger.info('Http server closed.');
      mongoose.connection.close(false, () => {
        process.exit(0);
      });
    });
  });
};
export default shutdownGracefully;
