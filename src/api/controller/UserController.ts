import { Filter, WithoutId, Document } from 'mongodb';
import { NextFunction, Request, Response } from 'express';

import { UserDB } from '../db/UserDb';
import { HttpMessage } from '../models/HttpMessage';
import { UserModel } from '../models/UserModel';
import { BaseCtrl } from './BaseController';

export class UserController extends BaseCtrl<UserModel> {
//   constructor() {
//     super(repository);
//   }

  async post(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { body = {} } = req;
    const data = await this.repository.post(body as UserModel ?? {});
    res.status(200).json(data);
  }

  async put(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { params = {}, body = {} } = req;
    const { id = null } = params;
    if (!id) {
      res.status(404).json({
        msg: 'Missing \'id\' field',
      });
      return;
    }
    const data = await this.repository.put(id as unknown as Pick<UserModel, '_id'>, body);
    res.status(200).json(data);
  }
}
