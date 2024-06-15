// @types/express.d.ts

import * as express from 'express';
import { JwtPayload } from 'jsonwebtoken';

import { Db, MongoClient } from 'mongodb';
import { UserModel } from '../src/api/models/UserModel';

declare global {
  namespace Express {
    interface Request {
      db: Db;
      client: MongoClient;
      self: string | JwtPayload<UserModel>;
      debug: boolean
    }
  }
}
