import { getEnv } from '../utils/helpers';
import * as dotenv from 'dotenv';
dotenv.config();

export const BullConnection = {
  host: getEnv('REDIS_URL'),
  port: +getEnv('REDIS_PORT'),
};

export const emailJobOptions = {
  removeOnComplete: true,
  removeOnFail: 500,
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 3000,
  },
};
