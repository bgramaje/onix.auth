import {
  Db,
} from 'mongodb';

import { Router } from './Router.ts';
import { TenantController } from '../controller/TenantController.ts';

export class TenantRouter extends Router {
  constructor(db: Db) {
    const controller = new TenantController(db);
    super(controller);
  }
}
