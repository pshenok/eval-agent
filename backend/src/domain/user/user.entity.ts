import { BaseEntity } from '../domain.types';

export class User implements BaseEntity {
    id: string;
    fullName: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}
