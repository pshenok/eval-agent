import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthModule } from '../../core/health/health.module';

@Module({
    imports: [HealthModule],
    controllers: [HealthController],
})
export class PublicModule {}
