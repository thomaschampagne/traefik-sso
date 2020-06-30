import { inject, singleton } from 'tsyringe';
import { AppConfig, DEFAULT_APP_CONFIG } from '@shared/models';
import fs from 'fs';
import { AppConfigException } from '../exceptions/app-config-exception';
import { Utils } from 'src/utils';
import { Constants } from '../constants';
import { LoggerService } from './logger-service';

@singleton()
export class AppConfigService {
    constructor(@inject(LoggerService) private readonly logger: LoggerService) {
        this.checkForConfig();
        this.logger.info(`Using config: ${Constants.CONFIG_PATH}`);
    }

    public loadConfig(): Promise<AppConfig> {
        this.checkForConfig();

        return new Promise<AppConfig>((resolve, reject) => {
            // Now read config file
            Utils.readFileAsync(Constants.CONFIG_PATH).then(
                (data: string) => {
                    try {
                        const appConfig = JSON.parse(data) as AppConfig;
                        resolve(appConfig);
                    } catch (parseError) {
                        reject(
                            new AppConfigException(
                                `Wrong json config file format: ${Constants.CONFIG_PATH}`
                            )
                        );
                    }
                },
                (err: NodeJS.ErrnoException) => {
                    reject(new AppConfigException(err.message));
                }
            );
        });
    }

    private checkForConfig(): void {
        if (!fs.existsSync(Constants.CONFIG_PATH)) {
            const defaultConfigData = JSON.stringify(DEFAULT_APP_CONFIG, null, 2);
            fs.writeFileSync(Constants.CONFIG_PATH, defaultConfigData);
            this.logger.info(
                `Missing config file. A default config has been created at: ${Constants.CONFIG_PATH}`
            );
        }
    }
}
