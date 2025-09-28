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
import { AgentService } from '../../domain/agent/agent.service';
import { 
    CreateAgentDto, 
    UpdateAgentDto, 
    AgentResponseDto, 
    OptimizeAgentsDto, 
    OptimizeAgentsResponseDto 
} from './agent.dto';

@ApiTags('Agents')
@Controller('agents')
export class AgentController {
    constructor(private readonly agentService: AgentService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new agent' })
    @ApiResponse({ 
        status: HttpStatus.CREATED, 
        description: 'Agent created successfully',
        type: AgentResponseDto 
    })
    @ApiResponse({ 
        status: HttpStatus.CONFLICT, 
        description: 'Agent name already exists' 
    })
    async create(@Body() dto: CreateAgentDto): Promise<AgentResponseDto> {
        return this.agentService.create(dto);
    }

    @Post('optimize')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ 
        summary: 'Optimize multiple agents into a single efficient agent using Claude AI',
        description: 'Takes multiple agent IDs, analyzes their stages, and creates an optimized agent using Claude AI'
    })
    @ApiResponse({ 
        status: HttpStatus.CREATED, 
        description: 'Agents optimized successfully and new agent created',
        type: OptimizeAgentsResponseDto 
    })
    @ApiResponse({ 
        status: HttpStatus.BAD_REQUEST, 
        description: 'Invalid input or optimization failed' 
    })
    @ApiResponse({ 
        status: HttpStatus.NOT_FOUND, 
        description: 'One or more agents not found' 
    })
    async optimizeAgents(@Body() dto: OptimizeAgentsDto): Promise<OptimizeAgentsResponseDto> {
        return this.agentService.optimizeAgents(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all agents' })
    @ApiQuery({ name: 'skip', required: false, type: Number, description: 'Number of records to skip' })
    @ApiQuery({ name: 'take', required: false, type: Number, description: 'Number of records to take' })
    @ApiResponse({ 
        status: HttpStatus.OK, 
        description: 'Agents retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                items: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/AgentResponseDto' }
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
    ) {
        const result = await this.agentService.findAll({
            skip: skip ? parseInt(skip, 10) : 0,
            take: take ? parseInt(take, 10) : 10,
        });
        
        return {
            items: result.data,
            meta: {
                totalItems: result.total,
                itemCount: result.data.length,
                itemsPerPage: result.take,
                totalPages: Math.ceil(result.total / result.take),
                currentPage: Math.floor(result.skip / result.take) + 1,
            },
        };
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get agents statistics' })
    @ApiResponse({ 
        status: HttpStatus.OK, 
        description: 'Statistics retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                totalAgents: { type: 'number' }
            }
        }
    })
    async getStats() {
        return this.agentService.getStats();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get agent by ID' })
    @ApiResponse({ 
        status: HttpStatus.OK, 
        description: 'Agent retrieved successfully',
        type: AgentResponseDto 
    })
    @ApiResponse({ 
        status: HttpStatus.NOT_FOUND, 
        description: 'Agent not found' 
    })
    async findOne(@Param('id') id: string): Promise<AgentResponseDto> {
        return this.agentService.findById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update agent' })
    @ApiResponse({ 
        status: HttpStatus.OK, 
        description: 'Agent updated successfully',
        type: AgentResponseDto 
    })
    @ApiResponse({ 
        status: HttpStatus.NOT_FOUND, 
        description: 'Agent not found' 
    })
    @ApiResponse({ 
        status: HttpStatus.CONFLICT, 
        description: 'Agent name already exists' 
    })
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateAgentDto,
    ): Promise<AgentResponseDto> {
        return this.agentService.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete agent' })
    @ApiResponse({ 
        status: HttpStatus.NO_CONTENT, 
        description: 'Agent deleted successfully' 
    })
    @ApiResponse({ 
        status: HttpStatus.NOT_FOUND, 
        description: 'Agent not found' 
    })
    async delete(@Param('id') id: string): Promise<void> {
        await this.agentService.delete(id);
    }
}
