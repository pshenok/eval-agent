import { BaseEntity } from '../domain.types';
import { Stage } from '../stage/stage.entity';

export class Agent implements BaseEntity {
    id: string;
    name: string;
    description: string;
    icon?: string;
    stages: Stage[];
    createdAt: Date;
    updatedAt: Date;
}
