import { Db } from 'mongodb';
import { Repository } from '../../common/classes/Repository';
import { AggregatedTenantModel, TenantModel } from '../models/TenantModel';

export class TenantRepository extends Repository<TenantModel> {
  constructor(collectionName: string, db: Db) {
    super(collectionName, db)
  }

  getAggregated = async (pipeline: any[]): Promise<AggregatedTenantModel[]> => {
    const entity = await this.collection
      .aggregate<AggregatedTenantModel>(pipeline as Document[])
      .toArray() as AggregatedTenantModel[];
    return entity;
  };

  getByIdAggregated = async (_id: string, pipeline: any[]): Promise<AggregatedTenantModel> => {
    const entity = (
      await this.collection
        .aggregate<AggregatedTenantModel>([
          ...pipeline,
          { $match: { _id } },
          { $limit: 1 },
        ]).toArray()
    )[0] as AggregatedTenantModel;
    return entity;
  };
}
