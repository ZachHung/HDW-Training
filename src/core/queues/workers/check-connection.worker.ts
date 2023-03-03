import { Worker } from 'bullmq';
import { BullConnection } from '../../config/bullMQ';
import { queueName } from '../repeat.queue';
import { checkConnection } from '../jobs/check-connection';

const checkConnectionWorker = new Worker(queueName, checkConnection, {
  connection: BullConnection,
});

export default checkConnectionWorker;
