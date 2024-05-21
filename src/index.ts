/* eslint-disable @typescript-eslint/no-namespace */
import express, { Request, Response, NextFunction } from 'express';
import { Db, MongoClient } from 'mongodb';
import morgan from 'morgan';
import { logger } from './config/logger';

const {
  MONGO_URL = 'mongodb://localhost:27017/auth',
  MONGO_DB = 'auth',
  PORT = 4000,
} = process.env;

const client = new MongoClient(MONGO_URL);

const app = express();

app.use(morgan(':remote-addr :method :url :status :res[content-length] - :response-time ms'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

(async () => {
  try {
    await client.connect();
    logger.info(`Successfully connected to ${MONGO_URL}`);

    app.use(async (req: Request, res: Response, next: NextFunction) => {
      const db: Db = client.db(MONGO_DB);
      req.db = db;
      next();
    });

    app.listen(PORT, () => logger.info(`Running 'orion-auth' at ${MONGO_URL}`));
  } catch (error) {
    console.log(error);
  }
})();
