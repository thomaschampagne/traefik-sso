import { inject, singleton } from 'tsyringe';
import { AppParams } from '../interfaces/app-params';
import { Env } from '../env';
import { Constants } from '../constants';
import { ServerException } from '../exceptions/server-exception';
import _ from 'lodash';
import versions from '../versions.json';
import { UsersService } from './users-service';
import { LogLevel } from '@modules/logger';
import { LoggerService } from './logger-service';

@singleton()
export class AppService {
    constructor(
        @inject(UsersService) private readonly usersService: UsersService,
        @inject(LoggerService) private readonly logger: LoggerService
    ) {
        this.appParams = this.fetchAppParams();
        this.assertCompliantParamsOrExit(); // Check app params or exit
    }

    public readonly appParams: AppParams;

    private static partialSecret(secret: string): string {
        return secret
            ? secret.slice(0, secret.length / 4).padEnd(secret.length + _.random(-3, 3), '*')
            : '';
    }

    public printInfos(): void {
        this.printParams();
        this.printDependenciesVersions();
        this.printDbPath();
        this.printCurrentUsers();
    }

    public getAppParams(): AppParams {
        return this.appParams;
    }

    private fetchAppParams(): AppParams {
        // Find environment target
        const targetEnv =
            process.env.TARGET_ENV && process.env.TARGET_ENV === 'prod' ? Env.PROD : Env.DEV;

        // Is running in docker
        const isInDocker = process.env.DOCKER === 'true';

        // Get level provided
        let logLevel: LogLevel;
        if (!process.env.LOG_LEVEL) {
            logLevel = LogLevel.DEBUG;
        } else {
            logLevel = _.get(LogLevel, process.env.LOG_LEVEL as string) as LogLevel;
        }

        // Test  if running in dev mode and in docker
        const isDevInDocker = targetEnv === Env.DEV && isInDocker;

        // Use domain provided in env variable if exists. Else set to empty if running in docker
        const domain = process.env.DOMAIN || (!isDevInDocker ? Constants.DEV_MACHINE_DOMAIN : '');

        // If cookie name given, use it. Else use domain to set a default one
        const cookieName = process.env.COOKIE_NAME
            ? process.env.COOKIE_NAME
            : `_${domain.replace(/\./g, '_')}_jwt`;

        // If secret given, use it. Else set to empty if running in docker
        const secret = process.env.SECRET || (!isDevInDocker ? Constants.DEV_MACHINE_SECRET : '');

        // Assign server params
        return {
            env: targetEnv,
            logLevel: logLevel,
            domain: domain,
            tokenMaxAge: process.env.TOKEN_MAX_AGE || Constants.DEFAULT_TOKEN_MAX_AGE,
            cookieName: cookieName,
            secret: secret,
            isInDocker: isInDocker
        };
    }

    private assertCompliantParamsOrExit(): void {
        try {
            if (LoggerService.VALID_LOG_LEVELS.indexOf(this.appParams.logLevel) === -1) {
                const validLogLevels = LoggerService.VALID_LOG_LEVELS.map(level => {
                    return LogLevel[level];
                }).join(', ');

                throw new ServerException(
                    `LOG_LEVEL "${process.env.LOG_LEVEL}" is invalid. Supported log levels are: ${validLogLevels}`
                );
            }

            if (!this.appParams.domain) {
                throw new ServerException('DOMAIN environment variable is missing.');
            }

            if (!this.appParams.secret) {
                throw new ServerException('SECRET environment variable is missing.');
            }

            if (
                this.appParams.tokenMaxAge &&
                !Constants.TOKEN_MAX_AGE_REGEX.exec(this.appParams.tokenMaxAge.toString())
            ) {
                throw new ServerException(
                    `Invalid TOKEN_MAX_AGE. Must be compliant with following regex pattern: ${Constants.TOKEN_MAX_AGE_REGEX}`
                );
            }
        } catch (error) {
            this.logger.error(error.message);
            process.exit(1);
        }
    }

    private printParams(): void {
        this.logger.info(`SSO Domain          =>  ${this.appParams.domain}`);
        this.logger.info(`Token Max Age       =>  ${this.appParams.tokenMaxAge}`);
        this.logger.info(`Cookie Token Name   =>  ${this.appParams.cookieName}`);
        this.logger.info(`Running In Docker   =>  ${this.appParams.isInDocker}`);
        this.logger.info(`Log Level           =>  ${LogLevel[this.appParams.logLevel]}`);
        this.logger.debug(
            `Secret              =>  ${AppService.partialSecret(this.appParams.secret)}`
        );
    }

    private printDependenciesVersions(): void {
        this.logger.info(
            `Running with Node v${process.versions.node}, Express v${versions.express}, JsonWebToken v${versions.jsonwebtoken}, Helmet v${versions.helmet}, Angular v${versions.angular}, Bootstrap v${versions.bootstrap}`
        );
    }

    private printDbPath(): void {
        this.logger.info(`Using json database: ${Constants.DB_PATH}`);
    }

    private printCurrentUsers(): void {
        this.logger.debug(`Users count in database: ${this.usersService.count()}`);
    }
}
