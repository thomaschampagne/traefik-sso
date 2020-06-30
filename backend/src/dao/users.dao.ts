import { PersistenceContext } from '../persistence-context';
import { inject, singleton } from 'tsyringe';
import { User } from '@shared/models';
import { BaseDao, IBaseDao } from './base.dao';
import { LoggerService } from '../services/logger-service';

export interface IUsersDao extends IBaseDao<User> {
    getByUsername(username: string): User | null;
}

@singleton()
export class UsersDao extends BaseDao<User> implements IUsersDao {
    private static readonly COLLECTION_NAME: string = 'users';
    private static readonly ID: string = 'username';

    constructor(
        @inject(PersistenceContext) persistenceContext: PersistenceContext,
        @inject(LoggerService) logger: LoggerService
    ) {
        super(persistenceContext, logger);
    }

    public getByUsername(username: string): User | null {
        return this.getById(username);
    }

    protected getCollectionName(): string {
        return UsersDao.COLLECTION_NAME;
    }

    protected getFieldId(): string {
        return UsersDao.ID;
    }
}
