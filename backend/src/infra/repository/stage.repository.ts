import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { IStageRepository } from '../../domain/stage/stage.repository.i';
import { Stage } from '../../domain/stage/stage.entity';
import { CreateStageDto, UpdateStageDto } from '../../domain/stage/stage.types';
import { PaginationParams, PaginatedResult } from '../../domain/domain.types';

@Injectable()
export class StageRepository implements IStageRepository {
    constructor(private readonly db: DatabaseService) {}

    async findById(id: string): Promise<Stage | null> {
        return this.db.stage.findUnique({
            where: { id },
        });
    }

    async findByAgentId(agentId: string): Promise<Stage[]> {
        return this.db.stage.findMany({
            where: { agentId },
            orderBy: { sequence: 'asc' },
        });
    }

    async create(data: CreateStageDto): Promise<Stage> {
        return this.db.stage.create({
            data,
        });
    }

    async update(id: string, data: UpdateStageDto): Promise<Stage> {
        return this.db.stage.update({
            where: { id },
            data,
        });
    }

    async delete(id: string): Promise<void> {
        await this.db.stage.delete({
            where: { id },
        });
    }

    async findAll(params: PaginationParams): Promise<PaginatedResult<Stage>> {
        const { skip = 0, take = 10, orderBy = { sequence: 'asc' } } = params;

        const [data, total] = await Promise.all([
            this.db.stage.findMany({
                skip,
                take,
                orderBy,
            }),
            this.db.stage.count(),
        ]);

        return {
            data,
            total,
            skip,
            take,
        };
    }

    async count(): Promise<number> {
        return this.db.stage.count();
    }
}
