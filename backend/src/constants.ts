import { Utils } from './utils';

export class Constants {
    public static readonly APP_PATH = __dirname;
    public static readonly DB_PATH = Utils.normalizePath(`${Constants.APP_PATH}/../data/db.json`);
    public static readonly CONFIG_PATH = Utils.normalizePath(
        `${Constants.APP_PATH}/../data/config.json`
    );
    public static readonly LOG_PATH = Utils.normalizePath(
        `${Constants.APP_PATH}/../logs/traefik-sso.log`
    );
    public static readonly LOG_ROTATE_MAX_FILE_SIZE = '5M'; // rotates the file when size exceeds 5 MegaBytes
    public static readonly LOG_ROTATE_INTERVAL = '1d'; // rotates every day at midnight
    public static readonly LOG_ROTATE_KEEP_FILES_COUNT = 60; // keep 60 rolling files
    public static readonly APP_BASE_HREF = '/';
    public static readonly SPA_PATH = Utils.normalizePath(`${Constants.APP_PATH}/spa`);
    public static readonly PORT = 3000;
    public static readonly DEFAULT_TOKEN_MAX_AGE = '7 days';
    public static readonly TOKEN_MAX_AGE_REGEX = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/;
    public static readonly REDIRECT_HEADER_KEY = 'x-redirect-to';
    public static readonly DEV_MACHINE_DOMAIN = 'dev.localhost';
    public static readonly DEV_MACHINE_SECRET = 's3cr3td3v';
}
