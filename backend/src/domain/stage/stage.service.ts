import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IStageRepository } from './stage.repository.i';
import { Stage } from './stage.entity';
import { CreateStageDto, UpdateStageDto } from './stage.types';
import { PaginationParams, PaginatedResult } from '../domain.types';

@Injectable()
export class StageService {
    constructor(
        @Inject('IStageRepository')
        private readonly stageRepository: IStageRepository,
    ) {}

    async findById(id: string): Promise<Stage> {
        const stage = await this.stageRepository.findById(id);
        if (!stage) {
            throw new NotFoundException('Stage not found');
        }
        return stage;
    }

    async findByAgentId(agentId: string): Promise<Stage[]> {
        return this.stageRepository.findByAgentId(agentId);
    }

    async create(data: CreateStageDto): Promise<Stage> {
        return this.stageRepository.create(data);
    }

    async update(id: string, data: UpdateStageDto): Promise<Stage> {
        await this.findById(id);
        return this.stageRepository.update(id, data);
    }

    async delete(id: string): Promise<void> {
        await this.findById(id);
        await this.stageRepository.delete(id);
    }

    async findAll(params?: PaginationParams): Promise<PaginatedResult<Stage>> {
        return this.stageRepository.findAll(params || {});
    }

    async getStats(): Promise<{ 
        totalStages: number; 
        byVendor: Record<string, number>; 
        byType: Record<string, number> 
    }> {
        const allStages = await this.stageRepository.findAll({ take: 1000 });
        const totalStages = allStages.total;
        
        const byVendor: Record<string, number> = {};
        const byType: Record<string, number> = {};
        
        allStages.data.forEach(stage => {
            byVendor[stage.vendor] = (byVendor[stage.vendor] || 0) + 1;
            byType[stage.type] = (byType[stage.type] || 0) + 1;
        });
        
        return { totalStages, byVendor, byType };
    }
}
