import { IController } from './IController';
import { Router as ExpressRouter } from 'express';

export declare interface IRouter {
    init(controller: IController): void;
    get(): ExpressRouter
}
