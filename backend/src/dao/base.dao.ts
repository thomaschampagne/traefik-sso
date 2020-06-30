import { JsonDB } from 'node-json-db';
import { PersistenceContext } from '../persistence-context';
import _ from 'lodash';
import { Constants } from '../constants';
import { LoggerService } from '../services/logger-service';

export interface IBaseDao<T> {
    getById(docId: string): T | null;

    findWhere(field: string, value: string): T | null;

    count(): number;
}

export abstract class BaseDao<T> implements IBaseDao<T> {
    protected readonly database: JsonDB;
    protected readonly collectionName: string;
    protected readonly fieldId: string;
    protected readonly collectionPath: string;

    protected constructor(
        protected readonly persistenceContext: PersistenceContext,
        protected readonly logger: LoggerService
    ) {
        this.database = this.persistenceContext.database;
        this.collectionName = this.getCollectionName();
        this.fieldId = this.getFieldId();
        this.collectionPath = PersistenceContext.DB_SEPARATOR + this.collectionName;
        this.initCollection();
        this.assertCollectionConsistency();
    }

    public findWhere(field: string, value: string): T | null {
        const document = this.database.find<T>(this.collectionPath, (entry: T) => {
            return _.get(entry, field) === value;
        });
        return document ? document : null;
    }

    public getById(docId: string): T | null {
        return this.findWhere(this.fieldId, docId);
    }

    public count(): number {
        return this.database.count(this.collectionPath);
    }

    public assertCollectionConsistency(): void {
        const docs = this.database.getData(this.collectionPath);
        _.forEach(_.countBy(docs, this.fieldId), (countByFieldId, index) => {
            if (countByFieldId > 1) {
                const message = `Duplicate documents referenced by same unique key '${this.fieldId}' and value '${index}' have been detected in collection
        '${this.collectionName}' (database: ${Constants.DB_PATH}).`;
                this.logger.error(message);
                process.exit(1);
            }
        });
    }

    protected abstract getCollectionName(): string;

    protected abstract getFieldId(): string;

    private initCollection(): void {
        const hasCollection = this.database.getData(PersistenceContext.DB_SEPARATOR)[
            this.collectionName
        ];
        if (!hasCollection) {
            this.database.push(this.collectionPath, []);
        }
    }
}
