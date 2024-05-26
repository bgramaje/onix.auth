import test, { Response } from 'supertest';
import { describe } from 'mocha';
import app from '../src/app';

describe('licenses', () => {
  it('should return all licenses', async () => {
    test(app)
      .get('/licenses')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err: Error, _res: Response) => {
        console.log(_res.body);
        if (err) throw err;
      });
  });
});
