// @types/express.d.ts

import * as express from 'express';

import { Db } from 'mongodb';

declare global {
  namespace Express {
    interface Request {
      db: Db;
    }
  }
}
