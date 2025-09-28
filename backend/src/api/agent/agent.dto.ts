import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class StageDto {
    @ApiProperty({ 
        example: 'Input Processing',
        description: 'Name of the stage' 
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ 
        example: 'This stage processes user input and prepares it for the LLM',
        description: 'Description of the stage',
        required: false 
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ 
        example: 1,
        description: 'Sequence order of the stage' 
    })
    @IsNotEmpty()
    sequence: number;

    @ApiProperty({ 
        example: 'User input text',
        description: 'Input description' 
    })
    @IsString()
    @IsNotEmpty()
    input: string;

    @ApiProperty({ 
        example: 'Processed output',
        description: 'Output description' 
    })
    @IsString()
    @IsNotEmpty()
    output: string;

    @ApiProperty({ 
        example: { metrics: ['accuracy', 'speed'] },
        description: 'Evaluation criteria',
        required: false 
    })
    @IsOptional()
    evaluation?: any;

    @ApiProperty({ 
        example: 'OpenAI',
        description: 'Vendor of the stage' 
    })
    @IsString()
    @IsNotEmpty()
    vendor: string;

    @ApiProperty({ 
        example: 'LLM',
        description: 'Type of the stage' 
    })
    @IsString()
    @IsNotEmpty()
    type: string;
}

export class CreateAgentDto {
    @ApiProperty({ 
        example: 'GPT Assistant',
        description: 'Name of the agent' 
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ 
        example: 'A helpful AI assistant for various tasks',
        description: 'Description of the agent' 
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ 
        example: '🤖',
        description: 'Icon for the agent',
        required: false 
    })
    @IsString()
    @IsOptional()
    icon?: string;
}

export class UpdateAgentDto {
    @ApiProperty({ 
        example: 'GPT Assistant',
        description: 'Name of the agent',
        required: false 
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ 
        example: 'A helpful AI assistant for various tasks',
        description: 'Description of the agent',
        required: false 
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ 
        example: '🤖',
        description: 'Icon for the agent',
        required: false 
    })
    @IsString()
    @IsOptional()
    icon?: string;
}

export class AgentResponseDto {
    @ApiProperty({ 
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Unique identifier' 
    })
    id: string;

    @ApiProperty({ 
        example: 'GPT Assistant',
        description: 'Name of the agent' 
    })
    name: string;

    @ApiProperty({ 
        example: 'A helpful AI assistant for various tasks',
        description: 'Description of the agent' 
    })
    description: string;

    @ApiProperty({ 
        example: '🤖',
        description: 'Icon for the agent' 
    })
    icon?: string;

    @ApiProperty({ 
        type: [StageDto],
        description: 'Stages of the agent' 
    })
    stages: StageDto[];

    @ApiProperty({ 
        example: '2024-01-01T00:00:00.000Z',
        description: 'Creation timestamp' 
    })
    createdAt: Date;

    @ApiProperty({ 
        example: '2024-01-01T00:00:00.000Z',
        description: 'Last update timestamp' 
    })
    updatedAt: Date;
}

export class OptimizeAgentsDto {
    @ApiProperty({ 
        example: ['123e4567-e89b-12d3-a456-426614174000', '456e7890-e89b-12d3-a456-426614174001'],
        description: 'Array of agent IDs to optimize',
        type: [String]
    })
    @IsArray()
    @IsUUID(4, { each: true })
    @IsNotEmpty({ each: true })
    agentIds: string[];

    @ApiProperty({ 
        example: 'Optimized Multi-Agent Pipeline',
        description: 'Name for the optimized agent',
        required: false
    })
    @IsString()
    @IsOptional()
    optimizedAgentName?: string;

    @ApiProperty({ 
        example: 'An optimized agent created by combining multiple agents',
        description: 'Description for the optimized agent',
        required: false
    })
    @IsString()
    @IsOptional()
    optimizedAgentDescription?: string;
}

export class OptimizeAgentsResponseDto {
    @ApiProperty({ 
        example: '789e0123-e89b-12d3-a456-426614174002',
        description: 'ID of the newly created optimized agent'
    })
    optimizedAgentId: string;

    @ApiProperty({ 
        example: 'Optimized Multi-Agent Pipeline',
        description: 'Name of the optimized agent'
    })
    optimizedAgentName: string;

    @ApiProperty({ 
        example: 5,
        description: 'Number of stages in the optimized agent'
    })
    stagesCount: number;

    @ApiProperty({ 
        example: ['123e4567-e89b-12d3-a456-426614174000', '456e7890-e89b-12d3-a456-426614174001'],
        description: 'Original agent IDs that were optimized'
    })
    sourceAgentIds: string[];

    @ApiProperty({ 
        example: 'Successfully optimized agents and created new pipeline with improved stage sequencing and reduced redundancy.',
        description: 'Optimization summary from Claude'
    })
    optimizationSummary: string;
}