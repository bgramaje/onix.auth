import { Db, MongoClient } from 'mongodb';

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
import { AuthRouter } from './api/router/AuthRouter.ts';

const {
  MONGO_URL = 'mongodb://localhost:27018',
  MONGO_DB = 'auth',
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

(async () => {
  try {
    await client.connect();
    logger.info(`Successfully connected to ${MONGO_URL}`);
    const db: Db = client.db(MONGO_DB);

    app.use((req: Request, res: Response, next: NextFunction) => {
      req.db = db;
      req.client = client;
      // set common base response for json
      res.set({ 'content-type': 'application/json; charset=utf-8' });
      next();
    });

    app.get('/', (_req, res) => {
      res.status(200).json({
        status: 200,
        message: 'Welcome to Onix authentication server',
      });
    });

    const userRouter = new UserRouter(db).get();
    const tenantRouter = new TenantRouter(db).get();
    const licenseRouter = new LicenseRouter(db).get();
    const authRouter = new AuthRouter(db).get();

    app.use(ROUTES.USERS, userRouter);
    app.use(ROUTES.TENANTS, tenantRouter);
    app.use(ROUTES.LICENSES, licenseRouter);
    app.use(ROUTES.AUTH, authRouter);

    app.use(notFoundMiddleware);
    app.use(errorMiddleware);
  } catch (error) {
    logger.error(error);
  }
})();

export default app;
