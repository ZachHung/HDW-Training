import moment from 'moment';
import { createLogger, transports, format } from 'winston';
import * as dotenv from 'dotenv';
import { getEnv } from './get-env';
dotenv.config();

const logger = createLogger({
  transports: new transports.File({
    dirname: 'logs',
    filename: 'winston_example.log',
  }),
  format: format.combine(
    format.timestamp({ format: () => moment().format('LTS DD-MM-YYYY') }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    }),
  ),
});

if (getEnv('NODE_ENV') !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  );
}
export default logger;
