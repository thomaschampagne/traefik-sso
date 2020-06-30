import { AppException } from './app-exception';

export class RestException extends AppException {
    constructor(message: string) {
        super(message);
    }
}
