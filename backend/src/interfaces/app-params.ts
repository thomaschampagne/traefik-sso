import { Env } from '../env';
import { LogLevel } from '@modules/logger';

export interface AppParams {
    env: Env;
    logLevel: LogLevel;
    secret: string;
    tokenMaxAge: number | string;
    domain: string;
    cookieName: string;
    isInDocker: boolean;
}
