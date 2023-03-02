import { getEnv } from '../utils/helpers';
import * as dotenv from 'dotenv';
dotenv.config();

export const BullConnection = {
  host: getEnv('REDIS_URL'),
  port: +getEnv('REDIS_PORT'),
};
