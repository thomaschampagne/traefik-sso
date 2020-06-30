import { JsonDB } from 'node-json-db';
import { singleton } from 'tsyringe';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import { Constants } from './constants';

@singleton()
export class PersistenceContext {
    public static readonly DB_SEPARATOR: string = '/';
    private static readonly SAVE_ON_PUSH_DB: boolean = true;
    private static readonly HUMAN_READABLE_DB: boolean = true;

    public readonly database: JsonDB;

    constructor() {
        this.database = new JsonDB(
            new Config(
                Constants.DB_PATH,
                PersistenceContext.SAVE_ON_PUSH_DB,
                PersistenceContext.HUMAN_READABLE_DB,
                PersistenceContext.DB_SEPARATOR
            )
        );
    }
}
