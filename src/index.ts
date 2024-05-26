import app from './app';
import { logger } from './config/logger';

const {
  MONGO_URL = 'mongodb://localhost:27018',
  PORT = 4000,
} = process.env;

app.listen(
  PORT,
  () => logger.info(`Running 'orion-auth' at ${MONGO_URL}`),
);
