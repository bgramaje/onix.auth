/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
import { MongoClient } from 'mongodb';
import request, { Response } from 'supertest';
import { Express } from 'express';

import {
  describe, before, it, Done,
} from 'mocha';

import { ROUTES } from '../src/config/routes';
import { setup } from '../src/app';
import { seedUsers } from '../src/db/mongodb.seed';

const {
  MONGO_URL = 'mongodb://localhost:27017',
  MONGO_DB = 'auth-test',
} = process.env;

describe('licenses', function () {
  let client: MongoClient;
  let app: Express;

  before(async () => {
    client = await MongoClient.connect(MONGO_URL);
    await seedUsers(client, MONGO_DB);

    app = await setup(client, MONGO_DB, false);
    request(app)
      .post(`${ROUTES.AUTH}/login`)
      .send({ username: 'test', password: 'test' })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(404)
      .end((err: Error, _res: Response) => {
        if (err) throw err;
        done();
      });
  });

  describe('GET licenses', () => {
    it('should return return a list of licenses', (done: Done) => {
      request(app)
        .get(ROUTES.LICENSES)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(404)
        .end((err: Error, _res: Response) => {
          if (err) throw err;
          done();
        });
    });
  });

  describe('authMiddleware', () => {
    it('should return 401 if \'Bearer\' not existing', (done: Done) => {
      request(app)
        .get(ROUTES.LICENSES)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(401)
        .end((err: Error, _res: Response) => {
          if (err) throw err;
          done();
        });
    });

    it('should return 403 if \'Bearer\' not correct', (done: Done) => {
      request(app)
        .get(ROUTES.LICENSES)
        .set('Authorization', 'Bearer TEST')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(403)
        .end((err: Error, _res: Response) => {
          if (err) throw err;
          done();
        });
    });
  });
});
