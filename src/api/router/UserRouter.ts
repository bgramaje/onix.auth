import {
  Db,
} from 'mongodb';

import { UserController } from '../controller/UserController.ts';
import { Router } from './Router.ts';

export class UserRouter extends Router {
  constructor(db: Db) {
    const controller = new UserController(db);
    super(controller);
  }
}
