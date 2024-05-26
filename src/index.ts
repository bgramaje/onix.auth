import { Db, MongoClient } from 'mongodb';

import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';

import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';


import { UserRouter } from './api/router/UserRouter.ts';
import { TenantRouter } from './api/router/TenantRouter.ts';
import { LicenseRouter } from './api/router/LicenseRouter.ts';

import { COLLECTIONS } from './config/collections.ts';
import { logger } from './config/logger.ts';
import { ROUTES } from './config/routes.ts';

import { notFoundMiddleware } from './api/middleware/notFoundMiddleware.ts';
import { errorMiddleware } from './api/middleware/errorMiddleware.ts';

const {
  MONGO_URL = 'mongodb://localhost:27018',
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

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

(async () => {
  try {
    await client.connect();
    logger.info(`Successfully connected to ${MONGO_URL}`);
    const db: Db = client.db(MONGO_DB);

    app.use((req: Request, _res: Response, next: NextFunction) => {
      req.db = db;
      req.client = client;
      next();
    });

    const { router: userRouter } = new UserRouter(db, COLLECTIONS.USERS);
    const { router: tenantRouter } = new TenantRouter(db, COLLECTIONS.TENANTS);
    const { router: licenseRouter } = new LicenseRouter(db, COLLECTIONS.LICENSES);

    app.use(ROUTES.USERS, userRouter);
    app.use(ROUTES.TENANTS, tenantRouter);
    app.use(ROUTES.LICENSES, licenseRouter);

    app.use(notFoundMiddleware);
    app.use(errorMiddleware);

    app.listen(PORT, () => logger.info(`Running 'orion-auth' at ${MONGO_URL}`));
  } catch (error) {
    logger.error(error);
  }
})();
