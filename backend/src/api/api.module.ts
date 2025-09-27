import { Module } from '@nestjs/common';
import { PublicModule } from './public/public.module';
import { UserApiModule } from './user/user.module';

@Module({
    imports: [PublicModule, UserApiModule],
})
export class ApiModule {}
