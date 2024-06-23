import {
  Filter,
  OptionalUnlessRequiredId,
} from 'mongodb';
import bcrypt from 'bcrypt';

import { HttpMessage } from '../models/HttpMessage';
import { Repository } from './Repository';
import { AggregatedUserModel, UserModel } from '../models/UserModel';
import { HttpStatusCode } from '../../enums/HttpStatusCode';

export class UserRepository extends Repository<UserModel> {
  getAggregated = async (pipeline: any[]): Promise<AggregatedUserModel[]> => {
    const entity = await this.collection
      .aggregate<AggregatedUserModel>(pipeline as Document[])
      .toArray() as AggregatedUserModel[];
    return entity;
  };

  getByIdAggregated = async (_id: string, pipeline: any[]): Promise<AggregatedUserModel> => {
    const entity = (
      await this.collection
        .aggregate<AggregatedUserModel>([
          ...pipeline,
          { $match: { _id } },
          { $limit: 1 },
        ]).toArray()
    )[0] as AggregatedUserModel;
    return entity;
  };

  post = async (entity: UserModel): Promise<Partial<HttpMessage>> => {
    const { _id: id = null, password } = entity;
    if (!id) throw new Error('[error] missing \'_id\' field');

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    await this.collection.insertOne({
      ...entity,
      password: hashedPassword,
    } as OptionalUnlessRequiredId<UserModel>,
    );

    return {
      status: HttpStatusCode.CREATED,
      msg: 'Successfully inserted new entity',
    };
  };

  getByUsername = async (username: string, opts?:object): Promise<UserModel | null> => {
    const filter : Filter<UserModel> = { username } as Filter<UserModel>;
    const entity = await this.collection.findOne(filter, opts) as UserModel | null;
    return entity;
  };
}
