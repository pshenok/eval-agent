import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { RepositoryModule } from '../../infra/database/repository.module';

@Module({
    imports: [RepositoryModule],
    providers: [AgentService],
    exports: [AgentService],
})
export class AgentModule {}
