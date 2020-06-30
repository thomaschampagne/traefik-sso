import { inject, singleton } from 'tsyringe';
import { User } from '@shared/models';
import { IUsersDao, UsersDao } from '../dao/users.dao';

@singleton()
export class UsersService {
    constructor(@inject(UsersDao) private usersDao: IUsersDao) {}

    public getByUsername(username: string): User | null {
        return this.usersDao.getByUsername(username);
    }

    public count(): number {
        return this.usersDao.count();
    }
}
