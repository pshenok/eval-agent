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
import { UserService } from '../../domain/user/user.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ 
        status: HttpStatus.CREATED, 
        description: 'User created successfully',
        type: UserResponseDto 
    })
    @ApiResponse({ 
        status: HttpStatus.CONFLICT, 
        description: 'Email already exists' 
    })
    async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
        return this.userService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiQuery({ name: 'skip', required: false, type: Number, description: 'Number of records to skip' })
    @ApiQuery({ name: 'take', required: false, type: Number, description: 'Number of records to take' })
    @ApiResponse({ 
        status: HttpStatus.OK, 
        description: 'Users retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                items: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/UserResponseDto' }
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
        const result = await this.userService.findAll({
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
    @ApiOperation({ summary: 'Get users statistics' })
    @ApiResponse({ 
        status: HttpStatus.OK, 
        description: 'Statistics retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                totalUsers: { type: 'number' }
            }
        }
    })
    async getStats() {
        return this.userService.getStats();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiResponse({ 
        status: HttpStatus.OK, 
        description: 'User retrieved successfully',
        type: UserResponseDto 
    })
    @ApiResponse({ 
        status: HttpStatus.NOT_FOUND, 
        description: 'User not found' 
    })
    async findOne(@Param('id') id: string): Promise<UserResponseDto> {
        return this.userService.findById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update user' })
    @ApiResponse({ 
        status: HttpStatus.OK, 
        description: 'User updated successfully',
        type: UserResponseDto 
    })
    @ApiResponse({ 
        status: HttpStatus.NOT_FOUND, 
        description: 'User not found' 
    })
    @ApiResponse({ 
        status: HttpStatus.CONFLICT, 
        description: 'Email already exists' 
    })
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateUserDto,
    ): Promise<UserResponseDto> {
        return this.userService.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete user' })
    @ApiResponse({ 
        status: HttpStatus.NO_CONTENT, 
        description: 'User deleted successfully' 
    })
    @ApiResponse({ 
        status: HttpStatus.NOT_FOUND, 
        description: 'User not found' 
    })
    async delete(@Param('id') id: string): Promise<void> {
        await this.userService.delete(id);
    }
}
