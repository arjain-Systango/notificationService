import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf } = format;
// Create the Winston logger
const logger = createLogger({
  format: combine(
    timestamp(),
    printf((info) => {
      return `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`;
    }),
  ),
  transports: [
    new transports.Console(), // Output logs to console
    new transports.File({ filename: 'error.log', level: 'error' }), // Output logs to a file
  ],
});

export default logger;
