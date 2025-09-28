import { useMutation, useQueryClient } from 'react-query';
import { agentApi } from '@services/api';
import type { OptimizeAgentsDto } from '@types/index';

export const useOptimizeAgents = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OptimizeAgentsDto) => agentApi.optimizeAgents(data),
    onSuccess: () => {
      // Invalidate all agent-related queries to refresh the data
      queryClient.invalidateQueries('agents');
      queryClient.invalidateQueries('agentStats');
      queryClient.invalidateQueries(['stages', 'agent']);
    },
  });
};
