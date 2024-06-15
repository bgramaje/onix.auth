/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
import { Db, Document, MongoClient } from 'mongodb';
import { Express } from 'express';
import 'mocha';
import { ROUTES } from '../src/config/routes';
import { setup } from '../src/app';

const chai = use(chaiHttp);

const {
  MONGO_URL = 'mongodb://localhost:27018',
  MONGO_DB = 'auth-test',
} = process.env;

describe('licenses', function () {
  let client: MongoClient;
  let app: Express;

  before(async () => {
    client = await MongoClient.connect(MONGO_URL);
    app = await setup(client, MONGO_DB, false);
  });
});
