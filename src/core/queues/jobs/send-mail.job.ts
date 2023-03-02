import transporter from '../../config/nodemailer';
import { createError, getEnv, HttpResponse } from '../../utils/helpers';
import { VoucherMailTemplate } from '../../utils/types/mail.template.type';
import * as dotenv from 'dotenv';
import { Job } from 'bullmq';
dotenv.config();

export type SendVoucherJob = VoucherMailTemplate & { to: string };

export const sendMailVoucherJob = async (job: Job<SendVoucherJob>) => {
  try {
    const { to, ...data } = job.data;
    await transporter.sendMail({
      from: getEnv('MAIL_USERNAME'),
      to: to,
      subject: '13Team xin gửi voucher cho bạn',
      templateName: 'email.template',
      templateData: data,
    });
    return new HttpResponse(200, job.data);
  } catch (error) {
    throw createError(500, 'Send mail fail');
  }
};
