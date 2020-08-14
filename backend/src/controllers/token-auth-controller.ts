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

            /*    const fetchDestType = req.headers['sec-fetch-dest'];
                if (fetchDestType && fetchDestType === 'empty') {
                    res.status(HttpStatus.OK).end();
                    return;
                }*/

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
                        this.forwardUserToLoginForm(res, req, sourceIp, redirectUrl); // User not authenticated
                    }
                );
            } else {
                this.logger.info(
                    `client@${sourceIp} tried to authenticate without ${this.appParams.cookieName} cookie token`
                );
                this.forwardUserToLoginForm(res, req, sourceIp, redirectUrl); // User not authenticated
            }
        });
    }

    private extractHeaderRedirectUrl(req: Request): string | null {
        const redirectUrl = req.headers[Constants.REDIRECT_HEADER_KEY];
        return (redirectUrl ? redirectUrl : null) as string | null;
    }

    private forwardUserToLoginForm(
        res: Response,
        req: Request,
        sourceIp: string,
        redirectUrl: string | null
    ): void {
        const unauthorizedResponse = res.status(HttpStatus.UNAUTHORIZED);

        if (redirectUrl) {
            // Let server perform the redirect
            this.logger.debug(
                `client@${sourceIp} is forwarded to sso login page for authentication. Redirect url will be: ${redirectUrl}`
            );

            const encodedRedirectUrl = `${Constants.APP_BASE_HREF}?redirect=${Base64.encode(
                redirectUrl
            )}`;
            unauthorizedResponse.redirect(encodedRedirectUrl);
        } else {
            unauthorizedResponse.redirect(Constants.APP_BASE_HREF);

            // Allow allow client to do it through javascript execution
            // res.header(
            //     'Content-Security-Policy',
            //     `script-src *.${this.appParams.domain} 'unsafe-inline';`
            // );
            //
            // // Send JS to execute
            // res.send(
            //     `<script>
            //             // Clear page cache
            //             window.caches.keys().then(cacheKeys => Promise.all(cacheKeys.map(key => window.caches.delete(key)))).then(() => {
            //                 // Redirect when cache deleted
            //                 window.location.replace('${req.protocol}://${req.hostname}/?redirect=' + btoa(window.location.href));
            //             }).catch(err => alert(err));
            //         </script>`
            // );
        }
    }
}
