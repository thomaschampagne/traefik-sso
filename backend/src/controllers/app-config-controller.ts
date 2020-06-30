import { inject, singleton } from 'tsyringe';
import { Express, Request, Response } from 'express';
import { AppService } from '../services/app-service';
import { BaseController } from './base-controller';
import { AppConfigService } from '../services/app-config-service';
import { AppConfig } from '@shared/models';
import { Utils } from '../utils';
import { LoggerService } from '../services/logger-service';
import { HttpStatus } from '@shared/enums';

@singleton()
export class AppConfigController extends BaseController {
    public static readonly ROUTE: string = '/config';

    constructor(
        @inject(AppService) readonly appService: AppService,
        @inject(AppConfigService) private readonly appConfigService: AppConfigService,
        @inject(LoggerService) private readonly logger: LoggerService
    ) {
        super(appService.getAppParams());
    }

    public register(app: Express): void {
        app.get(AppConfigController.ROUTE, (req: Request, res: Response, next) => {
            this.logger.debug(
                `HTTP/1.1 ${HttpStatus.OK} OK`,
                `client@${Utils.getSourceIp(req)} is getting remote app configuration`
            );
            this.appConfigService.loadConfig().then(
                (data: AppConfig) => {
                    res.json(data);
                },
                err => {
                    next(err);
                }
            );
        });
    }
}
