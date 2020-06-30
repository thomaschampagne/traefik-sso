import { RestException } from './rest-exception';

export class InvalidParameterException extends RestException {
    constructor(message: string) {
        super(message);
    }
}
