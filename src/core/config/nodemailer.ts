import { createTransport } from 'nodemailer';
import * as dotenv from 'dotenv';
import { getEnv } from '../utils/helpers/get-env';
import nodemailerMjmlPlugin from 'nodemailer-mjml';
import { join } from 'path';

dotenv.config();

const transporter = createTransport({
  host: getEnv('MAIL_HOST'),
  port: +getEnv('MAIL_PORT'),
  auth: {
    user: getEnv('MAIL_USERNAME'),
    pass: getEnv('MAIL_PASS'),
  },
});

transporter.use(
  'compile',
  nodemailerMjmlPlugin({ templateFolder: join(__dirname, '..', 'utils', 'templates') }),
);
export default transporter;
