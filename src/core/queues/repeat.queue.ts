import { Queue } from 'bullmq';
import { BullConnection } from '../config/bullMQ';

const queueName = 'repeat';

const RepeatQueue = new Queue(queueName, {
  connection: BullConnection,
});

export { RepeatQueue, queueName };
