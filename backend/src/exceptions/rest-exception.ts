import { ServerException } from './server-exception';

export class RestException extends ServerException {
    constructor(message: string) {
        super(message);
    }
}
