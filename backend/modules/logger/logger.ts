import { LogLevel } from './log-level';
import { LogTransport } from './log-transport';

interface IConsoleFuncMap {
    [Level: string]: (message?: any, ...optionalParams: any[]) => void;
}

// tslint:disable:no-console
export class Logger {
    constructor(level: LogLevel = LogLevel.INFO, name: string = Logger.DEFAULT_NAME) {
        this.level = level;
        this.name = name;
        this.optionalTransport = null;
    }

    private static DEFAULT_NAME = 'logger';
    private static LEVEL_LOG_FUNC_MAP: IConsoleFuncMap = {
        [LogLevel.DEBUG]: console.debug,
        [LogLevel.INFO]: console.log,
        [LogLevel.WARN]: console.warn,
        [LogLevel.ERROR]: console.error
    };

    protected level: LogLevel;
    protected optionalTransport: LogTransport | null;
    protected name: string;

    public debug(...args: [any?, ...any[]]): void | Promise<void> {
        return this.print(LogLevel.DEBUG, args);
    }

    public info(...args: [any?, ...any[]]): void | Promise<void> {
        return this.print(LogLevel.INFO, args);
    }

    public warn(...args: [any?, ...any[]]): void | Promise<void> {
        return this.print(LogLevel.WARN, args);
    }

    public error(...args: [any?, ...any[]]): void | Promise<void> {
        return this.print(LogLevel.ERROR, args);
    }

    public registerOptionalTransport(logTransport: LogTransport): void {
        this.optionalTransport = logTransport;
    }

    private print(level: LogLevel, args: [any?, ...any[]]): void | Promise<void> {
        if (level < this.level) {
            return;
        }

        this.appendLogHeader(level, args); // Add date and log level value in console
        this.apply(Logger.LEVEL_LOG_FUNC_MAP[level], args); // Apply arguments to console function

        return new Promise(resolve => {
            if (this.optionalTransport) {
                this.optionalTransport.appendAsync
                    ? this.optionalTransport.append(args, resolve)
                    : this.optionalTransport.appendSync(args);
            } else {
                resolve();
            }
        });
    }

    private apply(
        consoleFunc: (message?: any, ...optionalParams: any[]) => void,
        args: [any?, ...any[]]
    ): void {
        consoleFunc.apply(this, args);
    }

    private appendLogHeader(level: LogLevel, args: [any?, ...any[]]): [any?, ...any[]] {
        args.unshift(LogLevel[level]);
        args.unshift(new Date().toISOString());
        return args;
    }
}
