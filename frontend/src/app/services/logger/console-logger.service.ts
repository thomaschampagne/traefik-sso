/* tslint:disable:no-console */
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LoggerService } from './logger.service';

@Injectable()
export class ConsoleLoggerService implements ConsoleLoggerService {
    get debug() {
        return environment.logLevel <= LoggerService.LEVEL_DEBUG
            ? console.debug.bind(console)
            : this.noop;
    }

    get info() {
        return environment.logLevel <= LoggerService.LEVEL_INFO
            ? console.info.bind(console)
            : this.noop;
    }

    get warn() {
        return environment.logLevel <= LoggerService.LEVEL_WARN
            ? console.warn.bind(console)
            : this.noop;
    }

    get error() {
        return console.error.bind(console);
    }

    private noop = () => undefined;
}
