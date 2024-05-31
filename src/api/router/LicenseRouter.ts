import {
  Db,
} from 'mongodb';

import { Router } from './Router.ts';
import { LicenseController } from '../controller/LicenseController.ts';

export class LicenseRouter extends Router {
  constructor(db: Db) {
    const controller = new LicenseController(db);
    super(controller);
  }
}
