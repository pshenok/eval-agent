import axios from 'axios';
import type {
  Agent,
  Stage,
  CreateAgentDto,
  UpdateAgentDto,
  CreateStageDto,
  UpdateStageDto,
  PaginatedResponse,
  AgentStats,
  StageStats,
} from '@types/index';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Agent API
export const agentApi = {
  // Get all agents with pagination
  getAll: async (params?: { skip?: number; take?: number }): Promise<PaginatedResponse<Agent>> => {
    const response = await api.get('/agents', { params });
    return response.data;
  },

  // Get agent by ID
  getById: async (id: string): Promise<Agent> => {
    const response = await api.get(`/agents/${id}`);
    return response.data;
  },

  // Create new agent
  create: async (data: CreateAgentDto): Promise<Agent> => {
    const response = await api.post('/agents', data);
    return response.data;
  },

  // Update agent
  update: async (id: string, data: UpdateAgentDto): Promise<Agent> => {
    const response = await api.put(`/agents/${id}`, data);
    return response.data;
  },

  // Delete agent
  delete: async (id: string): Promise<void> => {
    await api.delete(`/agents/${id}`);
  },

  // Get agent statistics
  getStats: async (): Promise<AgentStats> => {
    const response = await api.get('/agents/stats');
    return response.data;
  },
};

// Stage API
export const stageApi = {
  // Get all stages with pagination and filters
  getAll: async (params?: {
    skip?: number;
    take?: number;
    agentId?: string;
    vendor?: string;
    type?: string;
  }): Promise<PaginatedResponse<Stage>> => {
    const response = await api.get('/stages', { params });
    return response.data;
  },

  // Get stage by ID
  getById: async (id: string): Promise<Stage> => {
    const response = await api.get(`/stages/${id}`);
    return response.data;
  },

  // Get stages by agent ID - это основной метод для получения stages агента
  getByAgentId: async (agentId: string): Promise<Stage[]> => {
    try {
      // Используем query parameter agentId для фильтрации
      const response = await api.get('/stages', { 
        params: { 
          agentId,
          take: 100 // Получаем все stages для агента
        } 
      });
      
      // Проверяем формат ответа - может быть PaginatedResponse или массив
      if (response.data.items) {
        // Пагинированный ответ
        return response.data.items.sort((a: Stage, b: Stage) => a.sequence - b.sequence);
      } else if (Array.isArray(response.data)) {
        // Прямой массив
        return response.data.sort((a: Stage, b: Stage) => a.sequence - b.sequence);
      } else {
        console.warn('Unexpected response format for stages:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching stages for agent:', agentId, error);
      return [];
    }
  },

  // Create new stage
  create: async (data: CreateStageDto): Promise<Stage> => {
    const response = await api.post('/stages', data);
    return response.data;
  },

  // Update stage
  update: async (id: string, data: UpdateStageDto): Promise<Stage> => {
    const response = await api.put(`/stages/${id}`, data);
    return response.data;
  },

  // Delete stage
  delete: async (id: string): Promise<void> => {
    await api.delete(`/stages/${id}`);
  },

  // Get stage statistics
  getStats: async (): Promise<StageStats> => {
    const response = await api.get('/stages/stats');
    return response.data;
  },
};

// Health API
export const healthApi = {
  check: async (): Promise<{ status: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;