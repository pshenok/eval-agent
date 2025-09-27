import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ 
        example: 'John Doe',
        description: 'Full name of the user' 
    })
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({ 
        example: 'user@example.com',
        description: 'Email address of the user' 
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class UpdateUserDto {
    @ApiProperty({ 
        example: 'John Doe',
        description: 'Full name of the user',
        required: false 
    })
    @IsString()
    @IsOptional()
    fullName?: string;

    @ApiProperty({ 
        example: 'user@example.com',
        description: 'Email address of the user',
        required: false 
    })
    @IsEmail()
    @IsOptional()
    email?: string;
}

export class UserResponseDto {
    @ApiProperty({ 
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Unique identifier' 
    })
    id: string;

    @ApiProperty({ 
        example: 'John Doe',
        description: 'Full name of the user' 
    })
    fullName: string;

    @ApiProperty({ 
        example: 'user@example.com',
        description: 'Email address of the user' 
    })
    email: string;

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
