import { MongoClient } from 'mongodb';
import { setup } from './app';
import { logger } from './config/logger';
import { seedUsers } from './db/mongodb.seed';

const {
  PORT = 4000,
  MONGO_URL = 'mongodb://localhost:27017',
  MONGO_DB = 'auth',
} = process.env;

(async () => {
  try {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    logger.info(`Successfully connected to ${MONGO_URL}`);
    await seedUsers(client, MONGO_DB);

    const app = await setup(client, MONGO_DB);
    app.listen(
      PORT,
      () => logger.info(`Running 'orion-auth' at ${PORT}`),
    );
  } catch (error) {
    logger.error(error);
    process.exit();
  }
})();

