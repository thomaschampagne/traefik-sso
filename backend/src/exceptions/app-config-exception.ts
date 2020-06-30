import { ServerException } from './server-exception';

export class AppConfigException extends ServerException {
    constructor(message: string) {
        super(message);
    }
}
