// Base types
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Agent types
export interface Agent extends BaseEntity {
  name: string;
  description: string;
  icon?: string;
  stages: Stage[];
}

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

// Stage types
export interface Stage extends BaseEntity {
  name: string;
  description?: string;
  sequence: number;
  input: string;
  output: string;
  evaluation?: Record<string, any>;
  vendor: string;
  type: string;
  agentId: string;
}

export interface CreateStageDto {
  name: string;
  description?: string;
  sequence: number;
  input: string;
  output: string;
  evaluation?: Record<string, any>;
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
  evaluation?: Record<string, any>;
  vendor?: string;
  type?: string;
}

// API Response types
export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface ApiError {
  statusCode: number;
  message: string;
  timestamp: string;
}

// Statistics types
export interface AgentStats {
  totalAgents: number;
}

export interface StageStats {
  totalStages: number;
  byVendor: Record<string, number>;
  byType: Record<string, number>;
}

// UI types
export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  active?: boolean;
}

export interface FilterOptions {
  vendor?: string;
  type?: string;
  agentId?: string;
}
