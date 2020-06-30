import { singleton } from 'tsyringe';
import { FileLogTransport, Logger, LogLevel } from '@modules/logger';
import { Utils } from '../utils';
import path from 'path';
import { Constants } from '../constants';

@singleton()
export class LoggerService extends Logger {
    private static readonly NAME = 'traefik-sso';

    public static readonly VALID_LOG_LEVELS = [
        LogLevel.DEBUG,
        LogLevel.INFO,
        LogLevel.WARN,
        LogLevel.ERROR
    ];

    constructor() {
        super();

        this.name = LoggerService.NAME;

        const logsDirPath = path.dirname(Constants.LOG_PATH);
        if (!Utils.exists(logsDirPath)) {
            Utils.mkdir(logsDirPath);
        }
        this.registerOptionalTransport(new FileLogTransport(Constants.LOG_PATH));
    }

    public setLevel(logLevel: LogLevel): void {
        this.level = logLevel;
    }
}
