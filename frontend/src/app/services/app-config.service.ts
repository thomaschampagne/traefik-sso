import { Injectable } from '@angular/core';
import { AppConfig, DEFAULT_APP_CONFIG } from '@shared/models';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { LoggerService } from './logger/logger.service';

@Injectable()
export class AppConfigService {
    private static readonly CONFIG_API_PATH = '/config';

    private appConfig: AppConfig;

    constructor(
        private readonly sanitizer: DomSanitizer,
        private readonly httpClient: HttpClient,
        private readonly logger: LoggerService
    ) {
        this.appConfig = null;
    }

    public get(): Promise<AppConfig> {
        if (this.appConfig) {
            return Promise.resolve(this.appConfig);
        }

        return this.httpClient
            .get<AppConfig>(AppConfigService.CONFIG_API_PATH)
            .toPromise()
            .then((appConfig: AppConfig) => {
                this.appConfig = appConfig;
                return Promise.resolve(this.appConfig);
            })
            .catch(() => {
                this.logger.error('Unable to load remote config. Load the default one.');
                this.appConfig = DEFAULT_APP_CONFIG;
                return Promise.resolve(this.appConfig);
            });
    }

    public sanitize(source: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(source);
    }
}
