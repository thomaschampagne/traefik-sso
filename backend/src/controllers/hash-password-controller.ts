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
        app.get(HashPasswordController.ROUTE, (req: Request, res: Response) => {
            if (req.query.credentials) {
                const credentials = (req.query.credentials as string).split(/:(.+)/);

                if (credentials) {
                    const username = credentials[0];
                    const plainPassword = credentials[1];

                    if (username && plainPassword) {
                        const user = new User(
                            username,
                            this.authService.hashPassword(plainPassword)
                        );
                        res.json(user).end();
                        return;
                    }
                }
            }

            throw new InvalidParameterException(
                `No proper credentials given in query parameters. Please provide them with \'?credentials=username:password\' in the url`
            );
        });
    }
}
