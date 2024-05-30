import { NextFunction, Response, Request } from 'express';

import { UserModel } from '../models/UserModel';
import { AuthModel } from '../models/AuthModel';
import { TenantModel } from '../models/TenantModel';
import { LicenseModel } from '../models/LicenseModel';

export type DbModel = UserModel | AuthModel | TenantModel | LicenseModel

export declare interface IController {
    post(req: Request, res: Response, next: NextFunction): Promise<void>;
    put(req: Request, res: Response, next: NextFunction): Promise<void>;
    get(req: Request, res: Response, next: NextFunction): Promise<void>;
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
}
