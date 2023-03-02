import { Worker } from 'bullmq';
import { BullConnection } from '../config/bullMQ';
import logger from '../config/logger';
import { queueName } from './email.queue';
import { sendMailVoucherJob } from './jobs/send-mail.job';

const emailWorker = new Worker(queueName, sendMailVoucherJob, {
  connection: BullConnection,
});
emailWorker.on('completed', (job, value) => {
  logger.info('Sent voucher to ' + value.data.to);
});
emailWorker.on('failed', (job) => {
  logger.error(`Failed send voucher job at ${job?.id}`);
});

export default emailWorker;
