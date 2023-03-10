import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import logger from '../../config/logger';
dotenv.config();

export const checkConnection = async (): Promise<void> => {
  logger.info('Checking database connection...');
  switch (mongoose.connection.readyState) {
    case 1:
      logger.info('🟢 Connection is good, carry on 🟢');
      return;

    case 3:
      logger.info('🟠 Connection is failing 🟠');
      return;

    case 0:
      logger.info('🔴 Connection has failed 🔴');
      return;

    default:
      return;
  }
};
