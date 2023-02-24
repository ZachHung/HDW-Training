import mongoose, { Connection } from 'mongoose';
import { getEnv } from '../utils/helpers/get-env';
import * as dotenv from 'dotenv';
dotenv.config();

let mongooseConnection: Connection;
async function connectMongoDB(): Promise<void> {
  try {
    mongoose.connection.on('connecting', () => {
      console.log(`MongoDB: connecting.`);
    });
    mongoose.connection.on('connected', () => {
      console.log('MongoDB: connected.');
    });
    mongoose.connection.on('disconnecting', () => {
      console.log('MongoDB: disconnecting.');
    });
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB: disconnected.');
    });

    if (mongoose.connection.readyState !== 1 && mongoose.connection.readyState !== 2) {
      const conn = await mongoose.connect(getEnv('MONGO_URI'), {
        autoIndex: true,
        serverSelectionTimeoutMS: 5000,
      });
      mongooseConnection = conn.connection;
    }
  } catch (error) {
    console.log(`Error connecting to DB`, error);
  }
}
export default connectMongoDB;
