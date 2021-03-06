import { inject, singleton } from 'tsyringe';
import { Express, Request, Response } from 'express';
import { AuthService } from '../services/auth-service';
import { AppService } from '../services/app-service';
import { BaseController } from './base-controller';
import { Constants } from '../constants';
import { LoggerService } from '../services/logger-service';
import { Utils } from '../utils';
import { HttpStatus } from '@shared/enums';

@singleton()
export class LogoutController extends BaseController {
    public static readonly ROUTE: string = '/logout';

    constructor(
        @inject(AuthService) private readonly authService: AuthService,
        @inject(AppService) appService: AppService,
        @inject(LoggerService) private readonly logger: LoggerService
    ) {
        super(appService.getAppParams());
    }

    public register(app: Express): void {
        app.get(LogoutController.ROUTE, (req: Request, res: Response) => {
            this.authService.clearAuthCookie(res);
            res.status(HttpStatus.NO_CONTENT).redirect(Constants.APP_BASE_HREF);
            this.logger.debug(
                `HTTP/2 ${HttpStatus.NO_CONTENT} NO_CONTENT`,
                `client@${Utils.getSourceIp(req)} initiated logout procedure`
            );
        });
    }
}
