import { Module } from '@nestjs/common';
import { StageController } from './stage.controller';
import { StageModule as DomainStageModule } from '../../domain/stage/stage.module';

@Module({
    imports: [DomainStageModule],
    controllers: [StageController],
})
export class StageApiModule {}
