import { LogTransport } from './log-transport';
import rfs, { RotatingFileStream } from 'rotating-file-stream';
import { Utils } from '../../src/utils';
import { Constants } from '../../src/constants';

export class FileLogTransport extends LogTransport {
    constructor(
        path: string,
        appendAsync: boolean = FileLogTransport.APPEND_ASYNC,
        separator: string = FileLogTransport.DEFAULT_SEPARATOR
    ) {
        super();
        this.path = path;
        this.appendAsync = appendAsync;
        this.separator = separator;

        this.rotatingFileStream = rfs.createStream(
            FileLogTransport.generateRollingLogFileName(this.path),
            {
                size: Constants.LOG_ROTATE_MAX_FILE_SIZE,
                interval: Constants.LOG_ROTATE_INTERVAL,
                maxFiles: Constants.LOG_ROTATE_KEEP_FILES_COUNT,
                encoding: 'utf-8',
                history: `${Utils.dirname(this.path)}/logrotate`
            }
        );
    }

    private static readonly DEFAULT_SEPARATOR = '\t';
    private static readonly APPEND_ASYNC = false;

    public readonly appendAsync: boolean;

    private readonly path: string;
    private readonly separator: string;
    private rotatingFileStream: RotatingFileStream;

    private static generateRollingLogFileName(
        logPath: string
    ): (time: number | Date, index?: number) => string {
        return (time: number | Date, index?: number) => {
            if (!time) {
                return `${logPath}`;
            }
            const today = new Date().toISOString().slice(0, 10);
            const extPos = logPath.lastIndexOf('.');
            return `${logPath.substring(0, extPos)}.${today}.${index}${logPath.substring(extPos)}`;
        };
    }

    public append(args: [any, ...any[]], callback: () => void): void {
        const logLine = this.serializeArgs(args) + '\n';
        this.rotatingFileStream.write(logLine, callback);
    }

    public appendSync(args: [any, ...any[]]): void {
        const logLine = this.serializeArgs(args) + '\n';
        this.rotatingFileStream.write(logLine);
    }

    public serializeArgs(message?: any, ...optionalParams: any[]): string {
        optionalParams.unshift(message);

        const result = optionalParams[0].map((value: any) => {
            if (!value) {
                return value;
            }
            const type = value.constructor.name.toLowerCase();

            if (type === 'string' || type === 'number' || type === 'date') {
                return value;
            }

            if (type === 'error') {
                return (value as Error).message;
            }

            return JSON.stringify(value);
        });

        return result.join(this.separator);
    }
}
