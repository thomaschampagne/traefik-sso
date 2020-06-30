import { inject, singleton } from 'tsyringe';
import { UsersService } from './users-service';
import { Token, User } from '@shared/models';
import jwt from 'jsonwebtoken';
import BCrypt from 'bcryptjs';
import { AuthException } from '../exceptions/auth-exception';
import { Request, Response } from 'express';
import { AppService } from './app-service';
import { AppParams } from '../interfaces/app-params';
import { HttpStatus } from '@shared/enums';
import { Utils } from '../utils';
import { LoggerService } from './logger-service';

@singleton()
export class AuthService {
    private readonly appParams: AppParams;

    constructor(
        @inject(UsersService) private readonly usersService: UsersService,
        @inject(AppService) private readonly appService: AppService,
        @inject(LoggerService) private readonly logger: LoggerService
    ) {
        this.appParams = this.appService.getAppParams();
    }

    public credentialsAuthentication(req: Request, res: Response, userToAuth: User): void {
        const userFoundDb = this.usersService.getByUsername(userToAuth.username);

        const sourceIp = Utils.getSourceIp(req);

        if (userFoundDb) {
            const passwordMatch = BCrypt.compareSync(userToAuth.password, userFoundDb.password);
            if (passwordMatch) {
                const jwtToken = jwt.sign(
                    { username: userFoundDb.username },
                    this.appParams.secret,
                    { expiresIn: this.appParams.tokenMaxAge }
                );
                this.sendAuthCookie(res, jwtToken);
            } else {
                throw new AuthException(
                    `client@${sourceIp} failed to authenticate with with username: ${userToAuth.username}`
                );
            }
        } else {
            throw new AuthException(
                `client@${sourceIp} tried to authenticate with non existing username: ${userToAuth.username}`
            );
        }
    }

    public sendAuthCookie(res: Response, jwtToken: string): void {
        const options = { httpOnly: true, domain: this.appParams.domain };
        res = res.cookie(this.appParams.cookieName, jwtToken, options);
        const token: Token = { jwt: jwtToken };
        res.status(HttpStatus.OK).json(token).end();
    }

    public clearAuthCookie(res: Response): void {
        res.clearCookie(this.appParams.cookieName, {
            domain: this.appParams.domain
        });
    }

    public hashPassword(plainPassword: string): string {
        return BCrypt.hashSync(plainPassword, BCrypt.genSaltSync());
    }

    public tokenAuthentication(res: Response, jwtToken: string): Promise<void> {
        return this.verifyJwtToken(jwtToken).catch(() => {
            this.clearAuthCookie(res);
            return Promise.reject();
        });
    }

    private verifyJwtToken(jwtToken: string): Promise<void> {
        return new Promise((resolve, reject) => {
            jwt.verify(jwtToken, this.appParams.secret, (err: any) => {
                err ? reject() : resolve();
            });
        });
    }
}
