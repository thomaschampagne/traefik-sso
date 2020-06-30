import { Express } from 'express';
import { AppParams } from '../interfaces/app-params';

export abstract class BaseController {
    protected constructor(protected readonly appParams: AppParams) {}

    public abstract register(app: Express): void;
}
