import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserModule as DomainUserModule } from '../../domain/user/user.module';

@Module({
    imports: [DomainUserModule],
    controllers: [UserController],
})
export class UserApiModule {}
