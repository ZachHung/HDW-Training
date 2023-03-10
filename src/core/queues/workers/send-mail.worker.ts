import { Job, Worker } from 'bullmq';
import { VoucherService } from '../../../vouchers/voucher.service';
import { BullConnection } from '../../config/bullMQ';
import logger from '../../config/logger';
import { queueName } from '../email.queue';
import { sendMailVoucherJob } from '../jobs/send-mail.job';

const emailWorker = new Worker(queueName, sendMailVoucherJob, {
  connection: BullConnection,
});
emailWorker.on('completed', (job) => {
  logger.info('Sent voucher to ' + job.data.to);
});
emailWorker.on('failed', async (job) => {
  logger.error(`Failed send voucher job at ${job?.id}`);
  await new VoucherService().deActivateVoucher(job?.data.Code || '');
});
emailWorker.on('error', (err) => {
  logger.error(`Error in ${queueName}:\n${JSON.stringify(err)}`);
});

export default emailWorker;
