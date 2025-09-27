import { Stage } from './stage.entity';
import { CreateStageDto, UpdateStageDto } from './stage.types';
import { PaginationParams, PaginatedResult } from '../domain.types';

export interface IStageRepository {
    findById(id: string): Promise<Stage | null>;
    findByAgentId(agentId: string): Promise<Stage[]>;
    create(data: CreateStageDto): Promise<Stage>;
    update(id: string, data: UpdateStageDto): Promise<Stage>;
    delete(id: string): Promise<void>;
    findAll(params: PaginationParams): Promise<PaginatedResult<Stage>>;
    count(): Promise<number>;
}
