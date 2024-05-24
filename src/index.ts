/* eslint-disable @typescript-eslint/no-namespace */
import express, { Request, Response, NextFunction } from 'express';
import { Db, MongoClient } from 'mongodb';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { logger } from './config/logger';
import { UserRouter } from './api/router/UserRouter';
import ROUTES from './config/routes';
import { TenantRouter } from './api/router/TenantRouter';
import { LicenseRouter } from './api/router/LicenseRouter';
import { COLLECTIONS } from './config/collections';

import { notFoundMiddleware } from './api/middleware/notFoundMiddleware';
import { errorMiddleware } from './api/middleware/errorMiddleware';

const {
  MONGO_URL = 'mongodb://localhost:27017/auth',
  MONGO_DB = 'auth',
  PORT = 4000,
} = process.env;

const client = new MongoClient(MONGO_URL);

const app = express();

app.use(morgan(':remote-addr :method :url :status :res[content-length] - :response-time ms'));
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

(async () => {
  try {
    await client.connect();
    logger.info(`Successfully connected to ${MONGO_URL}`);
    const db: Db = client.db(MONGO_DB);

    app.use((req, res, next) => {
      req.db = db;
      req.client = client;
      next();
    });

    const { router: userRouter } = new UserRouter(db, COLLECTIONS.USERS);
    // const { router: tenantRouter } = new TenantRouter(db, COLLECTIONS.TENANTS);
    // const { router: licenseRouter } = new LicenseRouter(db, COLLECTIONS.LICENSES);

    app.use(ROUTES.USERS, userRouter);
    // app.use(ROUTES.TENANTS, tenantRouter);
    // app.use(ROUTES.LICENSES, licenseRouter);
    app.use(notFoundMiddleware);
    app.use(errorMiddleware);

    app.listen(PORT, () => logger.info(`Running 'orion-auth' at ${MONGO_URL}`));
  } catch (error) {
    logger.error(error);
  }
})();
