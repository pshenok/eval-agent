import { Agent } from './agent.entity';
import { CreateAgentDto, UpdateAgentDto } from './agent.types';
import { PaginationParams, PaginatedResult } from '../domain.types';

export interface IAgentRepository {
    findById(id: string): Promise<Agent | null>;
    findByName(name: string): Promise<Agent | null>;
    create(data: CreateAgentDto): Promise<Agent>;
    update(id: string, data: UpdateAgentDto): Promise<Agent>;
    delete(id: string): Promise<void>;
    findAll(params: PaginationParams): Promise<PaginatedResult<Agent>>;
    count(): Promise<number>;
}
