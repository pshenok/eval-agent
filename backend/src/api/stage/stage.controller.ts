import { 
    Controller, 
    Get, 
    Post, 
    Put, 
    Delete, 
    Body, 
    Param, 
    Query,
    HttpCode,
    HttpStatus 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { StageService } from '../../domain/stage/stage.service';
import { CreateStageDto, UpdateStageDto, StageResponseDto } from './stage.dto';

@ApiTags('Stages')
@Controller('stages')
export class StageController {
    constructor(private readonly stageService: StageService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new stage' })
    @ApiResponse({ 
        status: HttpStatus.CREATED, 
        description: 'Stage created successfully',
        type: StageResponseDto 
    })
    async create(@Body() dto: CreateStageDto): Promise<StageResponseDto> {
        return this.stageService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all stages' })
    @ApiQuery({ name: 'skip', required: false, type: Number, description: 'Number of records to skip' })
    @ApiQuery({ name: 'take', required: false, type: Number, description: 'Number of records to take' })
    @ApiQuery({ name: 'agentId', required: false, type: String, description: 'Filter by agent ID' })
    @ApiQuery({ name: 'vendor', required: false, type: String, description: 'Filter by vendor' })
    @ApiQuery({ name: 'type', required: false, type: String, description: 'Filter by type' })
    @ApiResponse({ 
        status: HttpStatus.OK, 
        description: 'Stages retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                items: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/StageResponseDto' }
                },
                meta: {
                    type: 'object',
                    properties: {
                        totalItems: { type: 'number' },
                        itemCount: { type: 'number' },
                        itemsPerPage: { type: 'number' },
                        totalPages: { type: 'number' },
                        currentPage: { type: 'number' }
                    }
                }
            }
        }
    })
    async findAll(
        @Query('skip') skip?: string,
        @Query('take') take?: string,
        @Query('agentId') agentId?: string,
        @Query('vendor') vendor?: string,
        @Query('type') type?: string,
    ) {
        if (agentId) {
            const stages = await this.stageService.findByAgentId(agentId);
            return {
                items: stages,
                meta: {
                    totalItems: stages.length,
                    itemCount: stages.length,
                    itemsPerPage: stages.length,
                    totalPages: 1,
                    currentPage: 1,
                },
            };
        }

        const result = await this.stageService.findAll({
            skip: skip ? parseInt(skip, 10) : 0,
            take: take ? parseInt(take, 10) : 10,
        });
        
        // Apply vendor and type filters if provided
        let filteredData = result.data;
        if (vendor) {
            filteredData = filteredData.filter(stage => stage.vendor === vendor);
        }
        if (type) {
            filteredData = filteredData.filter(stage => stage.type === type);
        }
        
        return {
            items: filteredData,
            meta: {
                totalItems: filteredData.length,
                itemCount: filteredData.length,
                itemsPerPage: result.take,
                totalPages: Math.ceil(filteredData.length / result.take),
                currentPage: Math.floor(result.skip / result.take) + 1,
            },
        };
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get stages statistics' })
    @ApiResponse({ 
        status: HttpStatus.OK, 
        description: 'Statistics retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                totalStages: { type: 'number' },
                byVendor: { type: 'object' },
                byType: { type: 'object' }
            }
        }
    })
    async getStats() {
        return this.stageService.getStats();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get stage by ID' })
    @ApiResponse({ 
        status: HttpStatus.OK, 
        description: 'Stage retrieved successfully',
        type: StageResponseDto 
    })
    @ApiResponse({ 
        status: HttpStatus.NOT_FOUND, 
        description: 'Stage not found' 
    })
    async findOne(@Param('id') id: string): Promise<StageResponseDto> {
        return this.stageService.findById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update stage' })
    @ApiResponse({ 
        status: HttpStatus.OK, 
        description: 'Stage updated successfully',
        type: StageResponseDto 
    })
    @ApiResponse({ 
        status: HttpStatus.NOT_FOUND, 
        description: 'Stage not found' 
    })
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateStageDto,
    ): Promise<StageResponseDto> {
        return this.stageService.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete stage' })
    @ApiResponse({ 
        status: HttpStatus.NO_CONTENT, 
        description: 'Stage deleted successfully' 
    })
    @ApiResponse({ 
        status: HttpStatus.NOT_FOUND, 
        description: 'Stage not found' 
    })
    async delete(@Param('id') id: string): Promise<void> {
        await this.stageService.delete(id);
    }
}
