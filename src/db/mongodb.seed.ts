import { Db, MongoClient } from 'mongodb';
import { COLLECTIONS } from '../config/collections';
import { UserRepository } from '../api/repository/UserRepository';
import { UserModel } from '../api/models/UserModel';
import { Role } from '../api/models/RoleModel';
import { logger } from '../config/logger';

/**
 * @description seed user data inserting a test user for testing purposes
 * @param client MongoDB client connection
 * @param mongoDb MongoDB database name
 */
export const seedUsers = async (client: MongoClient, mongoDb : string) => {
  try {
    const db: Db = client.db(mongoDb);
    const repository = UserRepository.getInstance(COLLECTIONS.USERS, db) as UserRepository;

    const body: UserModel = {
      _id: 'test',
      username: 'test',
      password: 'test',
      role: Role.Super,
      tenant: null,
    };

    if (!(await repository.getByUsername(body.username))) {
      const data = await repository.post(body);
      logger.debug(data.msg);
    }
  } catch (err) {
    console.error('Error seeding data:', err);
  }
};
