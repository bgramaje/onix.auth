// @types/express.d.ts

import * as express from 'express';
import { JwtPayload } from 'jsonwebtoken';

import { Db, MongoClient } from 'mongodb';

declare global {
  namespace Express {
    interface Request {
      db: Db;
      client: MongoClient;
      entity: string | JwtPayload;
    }
  }
}
