import { Db, Document, MongoClient } from 'mongodb';
import { expect } from 'chai';
import 'mocha';

const {
  MONGO_URL = 'mongodb://localhost:27017',
  MONGO_DB = 'auth-test',
} = process.env;

describe('mongodb', async () => {
  let client: MongoClient;
  let db: Db;

  before(async () => {
    client = await MongoClient.connect(MONGO_URL);
    db = client.db(MONGO_DB);
  });

  after(async () => {
    if (client) await client.close();
  });

  it('should connect to database', async () => {
    const ping: Document = await db.admin().ping();
    expect(ping.ok).to.equal(1);
  });
});
