import { RestException } from './rest-exception';

export class AuthException extends RestException {
    constructor(message: string) {
        super(message);
    }
}
