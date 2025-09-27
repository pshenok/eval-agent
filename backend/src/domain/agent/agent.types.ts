export interface CreateAgentDto {
    name: string;
    description: string;
    icon?: string;
}

export interface UpdateAgentDto {
    name?: string;
    description?: string;
    icon?: string;
}
