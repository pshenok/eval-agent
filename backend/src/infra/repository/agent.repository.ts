import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { IAgentRepository } from '../../domain/agent/agent.repository.i';
import { Agent } from '../../domain/agent/agent.entity';
import { CreateAgentDto, UpdateAgentDto } from '../../domain/agent/agent.types';
import { PaginationParams, PaginatedResult } from '../../domain/domain.types';

@Injectable()
export class AgentRepository implements IAgentRepository {
    constructor(private readonly db: DatabaseService) {}

    async findById(id: string): Promise<Agent | null> {
        return this.db.agent.findUnique({
            where: { id },
            include: { stages: true },
        });
    }

    async findByName(name: string): Promise<Agent | null> {
        return this.db.agent.findFirst({
            where: { name },
            include: { stages: true },
        });
    }

    async create(data: CreateAgentDto): Promise<Agent> {
        return this.db.agent.create({
            data,
            include: { stages: true },
        });
    }

    async update(id: string, data: UpdateAgentDto): Promise<Agent> {
        return this.db.agent.update({
            where: { id },
            data,
            include: { stages: true },
        });
    }

    async delete(id: string): Promise<void> {
        await this.db.agent.delete({
            where: { id },
        });
    }

    async findAll(params: PaginationParams): Promise<PaginatedResult<Agent>> {
        const { skip = 0, take = 10, orderBy = { createdAt: 'desc' } } = params;

        const [data, total] = await Promise.all([
            this.db.agent.findMany({
                skip,
                take,
                orderBy,
                include: { stages: true },
            }),
            this.db.agent.count(),
        ]);

        return {
            data,
            total,
            skip,
            take,
        };
    }

    async count(): Promise<number> {
        return this.db.agent.count();
    }
}
