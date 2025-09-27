import { Module } from '@nestjs/common';
import { PublicModule } from './public/public.module';
import { AgentApiModule } from './agent/agent.module';
import { StageApiModule } from './stage/stage.module';

@Module({
    imports: [PublicModule, AgentApiModule, StageApiModule],
})
export class ApiModule {}
