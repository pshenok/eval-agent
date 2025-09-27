import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { IAgentRepository } from './agent.repository.i';
import { Agent } from './agent.entity';
import { CreateAgentDto, UpdateAgentDto } from './agent.types';
import { PaginationParams, PaginatedResult } from '../domain.types';

@Injectable()
export class AgentService {
    constructor(
        @Inject('IAgentRepository')
        private readonly agentRepository: IAgentRepository,
    ) {}

    async findById(id: string): Promise<Agent> {
        const agent = await this.agentRepository.findById(id);
        if (!agent) {
            throw new NotFoundException('Agent not found');
        }
        return agent;
    }

    async findByName(name: string): Promise<Agent | null> {
        return this.agentRepository.findByName(name);
    }

    async create(data: CreateAgentDto): Promise<Agent> {
        const existingAgent = await this.agentRepository.findByName(data.name);
        if (existingAgent) {
            throw new ConflictException('Agent name already exists');
        }
        return this.agentRepository.create(data);
    }

    async update(id: string, data: UpdateAgentDto): Promise<Agent> {
        const agent = await this.findById(id);
        
        if (data.name && data.name !== agent.name) {
            const existingAgent = await this.agentRepository.findByName(data.name);
            if (existingAgent && existingAgent.id !== id) {
                throw new ConflictException('Agent name already exists');
            }
        }
        
        return this.agentRepository.update(id, data);
    }

    async delete(id: string): Promise<void> {
        await this.findById(id);
        await this.agentRepository.delete(id);
    }

    async findAll(params?: PaginationParams): Promise<PaginatedResult<Agent>> {
        return this.agentRepository.findAll(params || {});
    }

    async getStats(): Promise<{ totalAgents: number }> {
        const totalAgents = await this.agentRepository.count();
        return { totalAgents };
    }
}
