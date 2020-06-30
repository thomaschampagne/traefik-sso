import { LogTransport } from './log-transport';
import { appendFile, appendFileSync } from 'fs';

export class FileLogTransport extends LogTransport {
    private static readonly DEFAULT_SEPARATOR = '\t';
    private static readonly APPEND_ASYNC = false;

    private readonly path: string;
    private readonly separator: string;
    public readonly appendAsync: boolean;

    constructor(
        path: string,
        appendAsync: boolean = FileLogTransport.APPEND_ASYNC,
        separator: string = FileLogTransport.DEFAULT_SEPARATOR
    ) {
        super();
        this.path = path;
        this.appendAsync = appendAsync;
        this.separator = separator;
    }

    public append(args: [any, ...any[]], callback?: () => void): void {
        const logLine = this.serializeArgs(args) + '\n';
        appendFile(this.path, logLine, err => {
            if (err) {
                console.error(err);
            }
            if (callback) {
                callback();
            }
        });
    }

    public appendSync(args: [any, ...any[]]): void {
        const logLine = this.serializeArgs(args) + '\n';
        appendFileSync(this.path, logLine);
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
