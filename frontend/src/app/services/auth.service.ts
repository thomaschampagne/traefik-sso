import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthException } from '../exceptions/auth-exception';
import { InvalidParameterException } from '../exceptions/invalid-parameter-exception';
import { RestException } from '../exceptions/rest-exception';
import { AppConfigService } from './app-config.service';
import { HttpStatus } from '@shared/enums';
import { Token, User } from '@shared/models';
import { LoggerService } from './logger/logger.service';

@Injectable()
export class AuthService {
    private static readonly LOGIN_API_PATH = '/login';
    private static readonly TOKEN_AUTH_API_PATH = '/auth';

    constructor(
        private httpClient: HttpClient,
        private appConfigService: AppConfigService,
        private logger: LoggerService
    ) {}

    public isAlreadyAuthorized(): Promise<boolean> {
        return this.httpClient
            .get(AuthService.TOKEN_AUTH_API_PATH)
            .toPromise()
            .then((token: Token) => {
                this.logger.info('Already authenticated');
                return Promise.resolve(!!token.jwt);
            })
            .catch(() => {
                return Promise.resolve(false);
            });
    }

    public authenticate(username: string, password: string): Promise<void> {
        const userToAuth: User = { username: username, password: password };

        return this.httpClient
            .post<Token>(AuthService.LOGIN_API_PATH, userToAuth)
            .toPromise()
            .then((token: Token) => {
                return this.getRedirectUrl().then(redirectUrl => {
                    if (redirectUrl) {
                        location.replace(redirectUrl);
                    }
                    return token.jwt
                        ? Promise.resolve()
                        : Promise.reject(new AuthException('Missing token'));
                });
            })
            .catch((err: HttpErrorResponse) => {
                return this.appConfigService.get().then(appConfig => {
                    const errorLabels = appConfig.labels.errors;

                    let error: Error = err;

                    switch (err.status) {
                        case HttpStatus.UNAUTHORIZED:
                            error = new AuthException(errorLabels.unauthorized);
                            break;

                        case HttpStatus.BAD_REQUEST:
                            error = new InvalidParameterException(errorLabels.badRequest);
                            break;

                        case HttpStatus.SERVER_ERROR:
                            error = new RestException(errorLabels.serverError);
                            break;
                    }

                    return Promise.reject(error);
                });
            });
    }

    private getRedirectUrl(): Promise<string> {
        return new Promise<string>(resolve => {
            setTimeout(() => {
                const urlParams = new URLSearchParams(window.location.search);
                const base64EncodedUrl = urlParams.get('redirect');
                if (base64EncodedUrl) {
                    const redirectUrl = atob(base64EncodedUrl);
                    resolve(redirectUrl);
                } else {
                    resolve(null);
                }
            });
        });
    }
}
