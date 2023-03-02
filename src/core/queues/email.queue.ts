import { Queue } from 'bullmq';
import { BullConnection } from '../config/bullMQ';

const queueName = 'email';

const emailQueue = new Queue(queueName, {
  connection: BullConnection,
});

export { emailQueue, queueName };
