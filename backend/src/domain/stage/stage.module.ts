import { Module } from '@nestjs/common';
import { StageService } from './stage.service';
import { RepositoryModule } from '../../infra/database/repository.module';

@Module({
    imports: [RepositoryModule],
    providers: [StageService],
    exports: [StageService],
})
export class StageModule {}
