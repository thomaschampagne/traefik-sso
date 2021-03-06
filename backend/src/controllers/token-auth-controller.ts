import { BaseController } from './base-controller';
import { Express, Request, Response } from 'express';
import { inject, singleton } from 'tsyringe';
import { Constants } from '../constants';
import { AppService } from '../services/app-service';
import { Base64 } from 'js-base64';
import { AuthService } from '../services/auth-service';
import { HttpStatus } from '@shared/enums';
import { Token } from '@shared/models';
import { LoggerService } from '../services/logger-service';
import { Utils } from '../utils';

@singleton()
export class TokenAuthController extends BaseController {
    public static readonly ROUTE: string = '/auth'; // Used by GET (static serve) and POST here

    constructor(
        @inject(AppService) readonly appService: AppService,
        @inject(AuthService) private readonly authService: AuthService,
        @inject(LoggerService) private readonly logger: LoggerService
    ) {
        super(appService.getAppParams());
    }

    public register(app: Express): void {
        app.get(TokenAuthController.ROUTE, (req: Request, res: Response) => {
            // Indicate user browser to not cache auth response
            res.set('Cache-control', `no-store, no-cache, max-age=0`);

            const sourceIp = Utils.getSourceIp(req);

            // Getting jwt token from cookie
            const userJwtToken = req.cookies[this.appParams.cookieName];

            // Extract redirect url from request headers
            const redirectUrl = this.extractHeaderRedirectUrl(req);

            // If token exists then verify it
            if (userJwtToken) {
                this.authService.tokenAuthentication(res, userJwtToken).then(
                    () => {
                        const token: Token = { jwt: userJwtToken };
                        res.status(HttpStatus.OK).json(token).end();
                        this.logger.debug(
                            `HTTP/2 ${HttpStatus.OK} OK`,
                            `client@${sourceIp} authenticated with a valid token`
                        );
                    },
                    () => {
                        this.logger.warn(
                            `client@${sourceIp} tried to authenticate with invalid token`
                        );
                        this.forwardUserToLoginForm(res, sourceIp, redirectUrl);
                    }
                );
            } else {
                this.logger.info(
                    `client@${sourceIp} tried to authenticate without ${this.appParams.cookieName} cookie token`
                );
                this.forwardUserToLoginForm(res, sourceIp, redirectUrl);
            }
        });
    }

    private extractHeaderRedirectUrl(req: Request): string | null {
        const redirectUrl = req.headers[Constants.REDIRECT_HEADER_KEY];
        return (redirectUrl ? redirectUrl : null) as string | null;
    }

    private forwardUserToLoginForm(
        res: Response,
        sourceIp: string,
        redirectUrl: string | null
    ): void {
        if (redirectUrl) {
            this.logger.debug(
                `client@${sourceIp} is forwarded to sso login page for authentication. Redirect url will be: ${redirectUrl}`
            );

            const encodedRedirectUrl = `${Constants.APP_BASE_HREF}?redirect=${Base64.encode(
                redirectUrl
            )}`;
            res.status(HttpStatus.UNAUTHORIZED).redirect(encodedRedirectUrl);
        } else {
            res.status(HttpStatus.UNAUTHORIZED).send();
        }
    }
}
