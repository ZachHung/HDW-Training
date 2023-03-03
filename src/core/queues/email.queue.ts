import { Queue } from 'bullmq';
import { BullConnection } from '../config/bullMQ';
import { createError } from '../utils/helpers';

const queueName = 'email';

const emailQueue = new Queue(queueName, {
  connection: BullConnection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: 500,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 3000,
    },
  },
});

export { emailQueue, queueName };
