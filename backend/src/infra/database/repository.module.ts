import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { AgentRepository } from '../repository/agent.repository';
import { StageRepository } from '../repository/stage.repository';

@Module({
    imports: [DatabaseModule],
    providers: [
        {
            provide: 'IAgentRepository',
            useClass: AgentRepository,
        },
        {
            provide: 'IStageRepository',
            useClass: StageRepository,
        },
    ],
    exports: ['IAgentRepository', 'IStageRepository'],
})
export class RepositoryModule {}
