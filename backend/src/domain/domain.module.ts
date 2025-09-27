import { Module } from '@nestjs/common';
import { AgentModule } from './agent/agent.module';
import { StageModule } from './stage/stage.module';

@Module({
    imports: [AgentModule, StageModule],
    exports: [AgentModule, StageModule],
})
export class DomainModule {}
