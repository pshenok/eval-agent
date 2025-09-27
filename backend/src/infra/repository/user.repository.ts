import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { IUserRepository } from '../../domain/user/user.repository.i';
import { User } from '../../domain/user/user.entity';
import { CreateUserDto, UpdateUserDto } from '../../domain/user/user.types';
import { PaginationParams, PaginatedResult } from '../../domain/domain.types';

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(private readonly db: DatabaseService) {}

    async findById(id: string): Promise<User | null> {
        return this.db.user.findUnique({
            where: { id },
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.db.user.findUnique({
            where: { email },
        });
    }

    async create(data: CreateUserDto): Promise<User> {
        return this.db.user.create({
            data,
        });
    }

    async update(id: string, data: UpdateUserDto): Promise<User> {
        return this.db.user.update({
            where: { id },
            data,
        });
    }

    async delete(id: string): Promise<void> {
        await this.db.user.delete({
            where: { id },
        });
    }

    async findAll(params: PaginationParams): Promise<PaginatedResult<User>> {
        const { skip = 0, take = 10, orderBy = { createdAt: 'desc' } } = params;

        const [data, total] = await Promise.all([
            this.db.user.findMany({
                skip,
                take,
                orderBy,
            }),
            this.db.user.count(),
        ]);

        return {
            data,
            total,
            skip,
            take,
        };
    }

    async count(): Promise<number> {
        return this.db.user.count();
    }
}
