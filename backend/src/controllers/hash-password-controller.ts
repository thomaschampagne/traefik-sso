import { inject, singleton } from 'tsyringe';
import { Express, Request, Response } from 'express';
import { InvalidParameterException } from '../exceptions/invalid-parameter-exception';
import { User } from '@shared/models';
import { AuthService } from '../services/auth-service';
import { AppService } from '../services/app-service';
import { BaseController } from './base-controller';

@singleton()
export class HashPasswordController extends BaseController {
    public static readonly ROUTE: string = '/hash';

    constructor(
        @inject(AuthService) private readonly authService: AuthService,
        @inject(AppService) readonly appService: AppService
    ) {
        super(appService.getAppParams());
    }

    public register(app: Express): void {
        app.post(HashPasswordController.ROUTE, (req: Request, res: Response) => {
            if (!req.body.username) {
                throw new InvalidParameterException('Please provide a username');
            }

            if (!req.body.password) {
                throw new InvalidParameterException('Please provide a password');
            }

            const username = req.body.username;
            const plainPassword = req.body.password;

            if (username && plainPassword) {
                const user = new User(username, this.authService.hashPassword(plainPassword));
                res.json(user).end();
                return;
            }
        });
    }
}
