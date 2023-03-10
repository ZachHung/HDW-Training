import { Queue } from 'bullmq';
import { BullConnection, emailJobOptions } from '../config/bullMQ';

const queueName = 'email';

const emailQueue = new Queue(queueName, {
  connection: BullConnection,
  defaultJobOptions: emailJobOptions,
});

export { emailQueue, queueName };
