import { Db, MongoClient } from 'mongodb';
import { COLLECTIONS } from '../config/collections';

import { logger } from '../config/logger';
import { UserRepository } from '../api/user/repository/UserRepository';
import { UserModel } from '../api/user/models/UserModel';
import { Role } from '../api/common/models/RoleModel';

/**
 * @description seed user data inserting a test user for testing purposes
 * @param client MongoDB client connection
 * @param mongoDb MongoDB database name
 */
export const seedUsers = async (client: MongoClient, mongoDb : string) => {
  try {
    const db: Db = client.db(mongoDb);
    const repository = UserRepository.getInstance<UserRepository>(COLLECTIONS.USERS, db);

    const body: UserModel = {
      _id: 'test',
      username: 'test',
      password: 'test',
      role: Role.Super,
      tenant: null,
    };
    
    const userExists = await repository.getByUsername(body.username)
    if (userExists) return;
    
    const data = await repository.post(body);
    logger.debug(data.msg);
  } catch (err) {
    console.error('Error seeding data:', err);
  }
};
