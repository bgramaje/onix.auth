import { format, createLogger, transports } from 'winston';

const {
  combine, timestamp, printf, simple, colorize,
} = format;

const customFormat = printf(({ level, message, timestamp: ts }) => `[${ts}] [${level}] : ${message}`);

export const logger = createLogger({
  level: 'info', // Set the default log level
  format: combine(
    colorize({ all: true }), // Add colors to the log messages
    simple(), // Simple log message format
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp to log messages
    customFormat,
  ),
  transports: [
    new transports.Console(),
  ],
});
