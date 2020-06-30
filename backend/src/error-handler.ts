import { NextFunction, Request, Response } from 'express';
import { AuthException } from './exceptions/auth-exception';
import { HttpStatus } from '@shared/enums';
import { InvalidParameterException } from './exceptions/invalid-parameter-exception';
import { AppConfigException } from './exceptions/app-config-exception';
import { container } from 'tsyringe';
import { LoggerService } from './services/logger-service';

interface ApiError {
    message: string;
    status: number;
    handled: boolean;
    printBody: boolean;
}

const UNHANDLED_ERROR_MESSAGE = 'UNHANDLED ERROR';

const logger = container.resolve(LoggerService);

export const ErrorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const errorMessage = error.message;

    const apiError: ApiError = {
        message: error.message,
        status: HttpStatus.SERVER_ERROR,
        handled: true,
        printBody: true
    };

    apiError.message = error.message;

    if (error instanceof AuthException) {
        apiError.status = HttpStatus.UNAUTHORIZED;
        apiError.printBody = false;
        logger.warn(`HTTP/1.1 ${HttpStatus.UNAUTHORIZED} Unauthorized`, errorMessage);
    } else if (error instanceof InvalidParameterException) {
        apiError.status = HttpStatus.BAD_REQUEST;
        logger.debug(`HTTP/1.1 ${HttpStatus.BAD_REQUEST} Bad request`, errorMessage);
    } else if (error instanceof AppConfigException) {
        logger.error(`HTTP/1.1 ${HttpStatus.SERVER_ERROR} Server error`, errorMessage);
        apiError.status = HttpStatus.SERVER_ERROR;
    } else {
        apiError.message = UNHANDLED_ERROR_MESSAGE;
        apiError.handled = false;
        logger.error(`HTTP/1.1 ${HttpStatus.SERVER_ERROR} Server error`, errorMessage);
    }

    const response = res.status(apiError.status);
    if (apiError.printBody) {
        response.json({ error: apiError.message }).end();
    } else {
        response.end();
    }

    if (!apiError.handled) {
        next(error);
    }
};
