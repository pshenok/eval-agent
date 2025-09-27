import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStageDto {
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
    @IsNumber()
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

    @ApiProperty({ 
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Agent ID' 
    })
    @IsString()
    @IsNotEmpty()
    agentId: string;
}

export class UpdateStageDto {
    @ApiProperty({ 
        example: 'Input Processing',
        description: 'Name of the stage',
        required: false 
    })
    @IsString()
    @IsOptional()
    name?: string;

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
        description: 'Sequence order of the stage',
        required: false 
    })
    @IsNumber()
    @IsOptional()
    sequence?: number;

    @ApiProperty({ 
        example: 'User input text',
        description: 'Input description',
        required: false 
    })
    @IsString()
    @IsOptional()
    input?: string;

    @ApiProperty({ 
        example: 'Processed output',
        description: 'Output description',
        required: false 
    })
    @IsString()
    @IsOptional()
    output?: string;

    @ApiProperty({ 
        example: { metrics: ['accuracy', 'speed'] },
        description: 'Evaluation criteria',
        required: false 
    })
    @IsOptional()
    evaluation?: any;

    @ApiProperty({ 
        example: 'OpenAI',
        description: 'Vendor of the stage',
        required: false 
    })
    @IsString()
    @IsOptional()
    vendor?: string;

    @ApiProperty({ 
        example: 'LLM',
        description: 'Type of the stage',
        required: false 
    })
    @IsString()
    @IsOptional()
    type?: string;
}

export class StageResponseDto {
    @ApiProperty({ 
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Unique identifier' 
    })
    id: string;

    @ApiProperty({ 
        example: 'Input Processing',
        description: 'Name of the stage' 
    })
    name: string;

    @ApiProperty({ 
        example: 'This stage processes user input and prepares it for the LLM',
        description: 'Description of the stage' 
    })
    description?: string;

    @ApiProperty({ 
        example: 1,
        description: 'Sequence order of the stage' 
    })
    sequence: number;

    @ApiProperty({ 
        example: 'User input text',
        description: 'Input description' 
    })
    input: string;

    @ApiProperty({ 
        example: 'Processed output',
        description: 'Output description' 
    })
    output: string;

    @ApiProperty({ 
        example: { metrics: ['accuracy', 'speed'] },
        description: 'Evaluation criteria' 
    })
    evaluation?: any;

    @ApiProperty({ 
        example: 'OpenAI',
        description: 'Vendor of the stage' 
    })
    vendor: string;

    @ApiProperty({ 
        example: 'LLM',
        description: 'Type of the stage' 
    })
    type: string;

    @ApiProperty({ 
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Agent ID' 
    })
    agentId: string;

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
