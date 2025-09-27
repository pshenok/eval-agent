import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { AgentModule as DomainAgentModule } from '../../domain/agent/agent.module';

@Module({
    imports: [DomainAgentModule],
    controllers: [AgentController],
})
export class AgentApiModule {}
