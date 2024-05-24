// @types/express.d.ts

import * as express from 'express';

import { Db, MongoClient } from 'mongodb';

declare global {
  namespace Express {
    interface Request {
      db: Db;
      client: MongoClient;
    }
  }
}
