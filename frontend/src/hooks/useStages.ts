import { useQuery, useMutation, useQueryClient } from 'react-query';
import { stageApi } from '@services/api';
import type { Stage, CreateStageDto, UpdateStageDto } from '@types/index';

// Query keys
const QUERY_KEYS = {
  stages: 'stages',
  stage: (id: string) => ['stage', id],
  stagesByAgent: (agentId: string) => ['stages', 'agent', agentId],
  stageStats: 'stageStats',
} as const;

// Custom hooks for stages
export const useStages = (params?: {
  skip?: number;
  take?: number;
  agentId?: string;
  vendor?: string;
  type?: string;
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.stages, params],
    queryFn: () => stageApi.getAll(params),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useStage = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.stage(id),
    queryFn: () => stageApi.getById(id),
    enabled: !!id,
  });
};

// Специальный хук для получения stages по agentId
export const useStagesByAgent = (agentId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.stagesByAgent(agentId),
    queryFn: () => stageApi.getByAgentId(agentId),
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => {
      // Сортируем stages по sequence
      if (Array.isArray(data)) {
        return data.sort((a, b) => a.sequence - b.sequence);
      }
      // Если data содержит items (пагинированный ответ)
      if (data?.items) {
        return data.items.sort((a, b) => a.sequence - b.sequence);
      }
      return [];
    }
  });
};

export const useStageStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.stageStats,
    queryFn: stageApi.getStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateStage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStageDto) => stageApi.create(data),
    onSuccess: (newStage) => {
      // Invalidate stages list
      queryClient.invalidateQueries(QUERY_KEYS.stages);
      queryClient.invalidateQueries(QUERY_KEYS.stageStats);
      // Invalidate agent-specific stages
      queryClient.invalidateQueries(QUERY_KEYS.stagesByAgent(newStage.agentId));
    },
  });
};

export const useUpdateStage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStageDto }) =>
      stageApi.update(id, data),
    onSuccess: (updatedStage) => {
      // Update the cache for this specific stage
      queryClient.setQueryData(QUERY_KEYS.stage(updatedStage.id), updatedStage);
      // Invalidate stages list
      queryClient.invalidateQueries(QUERY_KEYS.stages);
      // Invalidate agent-specific stages
      queryClient.invalidateQueries(QUERY_KEYS.stagesByAgent(updatedStage.agentId));
    },
  });
};

export const useDeleteStage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => stageApi.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries(QUERY_KEYS.stage(deletedId));
      // Invalidate stages list
      queryClient.invalidateQueries(QUERY_KEYS.stages);
      queryClient.invalidateQueries(QUERY_KEYS.stageStats);
      // Invalidate all agent-specific stage queries
      queryClient.invalidateQueries(['stages', 'agent']);
    },
  });
};