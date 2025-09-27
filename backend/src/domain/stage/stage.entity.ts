import { BaseEntity } from '../domain.types';

export class Stage implements BaseEntity {
    id: string;
    name: string;
    description?: string;
    sequence: number;
    input: string;
    output: string;
    evaluation?: any;
    vendor: string;
    type: string;
    agentId: string;
    createdAt: Date;
    updatedAt: Date;
}
