import { Express } from 'express';
import { setup } from './app';
import { logger } from './config/logger';

const {
  PORT = 4000,
} = process.env;

(async () => {
  try {
    const app: Express = await setup();
    app.listen(
      PORT,
      () => logger.info(`Running 'orion-auth' at ${PORT}`),
    );
  } catch (error) {
    logger.error(error);
  }
})();

