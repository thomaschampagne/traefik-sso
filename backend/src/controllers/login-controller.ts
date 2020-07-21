import { inject, singleton } from 'tsyringe';
import { Express, Request, Response } from 'express';
import { InvalidParameterException } from '../exceptions/invalid-parameter-exception';
import { User } from '@shared/models';
import { AuthService } from '../services/auth-service';
import { AppService } from '../services/app-service';
import { HttpStatus } from '@shared/enums';
import { BaseController } from './base-controller';
import { Utils } from '../utils';
import { LoggerService } from '../services/logger-service';

@singleton()
export class LoginController extends BaseController {
    public static readonly ROUTE: string = '/login';

    constructor(
        @inject(AuthService) private readonly authService: AuthService,
        @inject(AppService) readonly appService: AppService,
        @inject(LoggerService) private readonly logger: LoggerService
    ) {
        super(appService.getAppParams());
    }

    public register(app: Express): void {
        app.post(LoginController.ROUTE, (req: Request, res: Response) => {
            try {
                if (!req.body.username) {
                    throw new InvalidParameterException('Missing username');
                }

                if (!req.body.password) {
                    throw new InvalidParameterException(
                        `Missing password for username ${req.body.username}`
                    );
                }

                this.logger.info(
                    `client@${Utils.getSourceIp(req)} trying to authenticate with username: ${
                        req.body.username
                    }`
                );

                this.authService.credentialsAuthentication(
                    req,
                    res,
                    new User(req.body.username, req.body.password)
                );

                res.status(HttpStatus.OK).end();

                this.logger.info(
                    `HTTP/2 ${HttpStatus.OK} OK`,
                    `client@${Utils.getSourceIp(req)} is authenticated with username: ${
                        req.body.username
                    }`
                );
            } catch (err) {
                this.authService.clearAuthCookie(res);
                throw err;
            }
        });
    }
}
