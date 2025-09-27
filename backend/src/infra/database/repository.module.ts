import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { UserRepository } from '../repository/user.repository';

@Module({
    imports: [DatabaseModule],
    providers: [
        {
            provide: 'IUserRepository',
            useClass: UserRepository,
        },
    ],
    exports: ['IUserRepository'],
})
export class RepositoryModule {}
