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

export interface OptimizeAgentsDto {
    agentIds: string[];
    optimizedAgentName?: string;
    optimizedAgentDescription?: string;
}

export interface OptimizedStage {
    name: string;
    description?: string;
    sequence: number;
    input: string;
    output: string;
    evaluation?: any;
    vendor: string;
    type: string;
}

export interface ClaudeOptimizationResponse {
    optimizedAgentName: string;
    optimizedAgentDescription: string;
    stages: OptimizedStage[];
    optimizationSummary: string;
}
