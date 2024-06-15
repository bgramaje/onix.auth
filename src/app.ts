import { Db, MongoClient } from 'mongodb';

import express, {
  Express, Request, Response, NextFunction,
} from 'express';

import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';

import { UserRouter } from './api/router/UserRouter.ts';
import { TenantRouter } from './api/router/TenantRouter.ts';
import { LicenseRouter } from './api/router/LicenseRouter.ts';

import { ROUTES } from './config/routes.ts';

import { notFoundMiddleware } from './api/middleware/notFoundMiddleware.ts';
import { errorMiddleware } from './api/middleware/errorMiddleware.ts';
import { AuthRouter } from './api/router/AuthRouter.ts';

export const setup = async (
  client : MongoClient,
  mongoDb: string,
  debug = true,
): Promise<Express> => {
  const app = express();

  if (debug) app.use(morgan(':remote-addr :method :url :status :res[content-length] - :response-time ms'));
  app.use(helmet());
  app.use(cors());
  app.use(cookieParser());
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // hide express server headers information
  app.disable('x-powered-by');

  const db: Db = client.db(mongoDb);

  app.use((req: Request, res: Response, next: NextFunction) => {
    req.db = db;
    req.debug = debug;
    req.client = client;
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

  return app;
};
