import { useQuery, useMutation, useQueryClient } from 'react-query';
import { agentApi } from '@services/api';
import type { Agent, CreateAgentDto, UpdateAgentDto } from '@types/index';

// Query keys
const QUERY_KEYS = {
  agents: 'agents',
  agent: (id: string) => ['agent', id],
  agentStats: 'agentStats',
} as const;

// Custom hooks for agents
export const useAgents = (params?: { skip?: number; take?: number }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.agents, params],
    queryFn: () => agentApi.getAll(params),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAgent = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.agent(id),
    queryFn: () => agentApi.getById(id),
    enabled: !!id,
  });
};

export const useAgentStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.agentStats,
    queryFn: agentApi.getStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAgentDto) => agentApi.create(data),
    onSuccess: () => {
      // Invalidate and refetch agents list
      queryClient.invalidateQueries(QUERY_KEYS.agents);
      queryClient.invalidateQueries(QUERY_KEYS.agentStats);
    },
  });
};

export const useUpdateAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAgentDto }) =>
      agentApi.update(id, data),
    onSuccess: (updatedAgent) => {
      // Update the cache for this specific agent
      queryClient.setQueryData(QUERY_KEYS.agent(updatedAgent.id), updatedAgent);
      // Invalidate agents list to refresh it
      queryClient.invalidateQueries(QUERY_KEYS.agents);
    },
  });
};

export const useDeleteAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => agentApi.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries(QUERY_KEYS.agent(deletedId));
      // Invalidate agents list
      queryClient.invalidateQueries(QUERY_KEYS.agents);
      queryClient.invalidateQueries(QUERY_KEYS.agentStats);
    },
  });
};
