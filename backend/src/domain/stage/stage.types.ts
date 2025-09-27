export interface CreateStageDto {
    name: string;
    description?: string;
    sequence: number;
    input: string;
    output: string;
    evaluation?: any;
    vendor: string;
    type: string;
    agentId: string;
}

export interface UpdateStageDto {
    name?: string;
    description?: string;
    sequence?: number;
    input?: string;
    output?: string;
    evaluation?: any;
    vendor?: string;
    type?: string;
}
