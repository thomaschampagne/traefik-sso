import express, { Express, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { container, inject, singleton } from 'tsyringe';
import { LoginController } from './controllers/login-controller';
import { Constants } from './constants';
import { ErrorHandler } from './error-handler';
import InjectionToken from 'tsyringe/dist/typings/providers/injection-token';
import { TokenAuthController } from './controllers/token-auth-controller';
import { BaseController } from './controllers/base-controller';
import { LogoutController } from './controllers/logout-controller';
import { HashPasswordController } from './controllers/hash-password-controller';
import { PersistenceContext } from './persistence-context';
import { AppConfigController } from './controllers/app-config-controller';
import { LoggerService } from './services/logger-service';
import { AppService } from './services/app-service';

@singleton()
export class Server {
    private static readonly CONTROLLERS_TOKENS: InjectionToken<BaseController>[] = [
        TokenAuthController,
        AppConfigController,
        LoginController,
        LogoutController,
        HashPasswordController
    ];
    private readonly app: Express;

    constructor(
        @inject(PersistenceContext) private readonly persistenceContext: PersistenceContext,
        @inject(LoggerService) private readonly logger: LoggerService,
        @inject(AppService) private readonly appService: AppService
    ) {
        this.app = express();
        this.logger.setLevel(this.appService.getAppParams().logLevel); // Configure logger
    }

    public start(): void {
        this.logger.info(`~~~~~~~~~~~~ Starting server ~~~~~~~~~~~~`);

        // Print server infos
        this.appService.printInfos();

        // Helmet setup
        this.app.use(helmet());

        // Allow post body parsing
        this.app.use(bodyParser.json());

        // Provide easiest cookies parsing
        this.app.use(cookieParser());

        // Allow calls from web components with cookies
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            res.header('Access-Control-Allow-Origin', req.headers.origin);
            next();
        });

        // Trust proxies
        this.app.set('trust proxy', true);

        // Refresh database when login route is reached. Goal: load any new or deleted users from db
        this.app
            .route(Constants.APP_BASE_HREF)
            .get((req: Request, res: Response, next: NextFunction) => {
                this.persistenceContext.database.reload();
                this.logger.debug('Persistence context refreshed');
                next();
            });

        // Configure access sso login spa
        this.app.use(Constants.APP_BASE_HREF, express.static(Constants.SPA_PATH));

        // Inject and register api controllers
        Server.CONTROLLERS_TOKENS.forEach(controllerToken => {
            container.resolve(controllerToken).register(this.app);
        });

        // Setup error handler
        this.app.use(ErrorHandler);

        // Start HTTP TCP listening
        this.app.listen(Constants.PORT);

        this.logger.info(`Server started on port ${Constants.PORT}`);
    }
}
