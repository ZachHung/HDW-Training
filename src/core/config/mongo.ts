import mongoose, { Connection } from 'mongoose';
import { getEnv } from '../utils/helpers/get-env';
import * as dotenv from 'dotenv';
import logger from './logger';
dotenv.config();

let mongooseConnection: Connection;
async function connectMongoDB(): Promise<void> {
  try {
    mongoose.connection.on('connecting', () => {
      logger.info(`🔵 MongoDB: connecting.`);
    });
    mongoose.connection.on('connected', () => {
      logger.info('🟢 MongoDB: connected.');
    });
    mongoose.connection.on('disconnecting', () => {
      logger.warn('🟠 MongoDB: disconnecting.');
    });
    mongoose.connection.on('disconnected', () => {
      logger.warn('🔴 MongoDB: disconnected.');
    });

    if (mongoose.connection.readyState !== 1 && mongoose.connection.readyState !== 2) {
      mongoose.set('strictQuery', true);
      const conn = await mongoose.connect(getEnv('MONGO_URI'), {
        autoIndex: true,
        serverSelectionTimeoutMS: 5000,
      });
      mongooseConnection = conn.connection;
    }
  } catch (error) {
    logger.error(`Error connecting to DB`, error);
  }
}

export { connectMongoDB, mongooseConnection };
