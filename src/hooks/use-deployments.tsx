/** biome-ignore-all lint/nursery/noImportCycles: . */
import { useCallback, useEffect, useState } from 'react';
import { useCtx } from '@/app';
import { fetchProjectDeployments } from '@/lib/deployments';
import type { Deployments } from '@/types/vercel-sdk';

export const useDeployments = (projectId: string) => {
  const { teamId } = useCtx();
  const [isLoading, setIsLoading] = useState(true);
  const [deployments, setDeployments] = useState<Deployments>([]);
  const [error, setError] = useState<Error | null>(null);

  const fetchDeployment = useCallback(async () => {
    setIsLoading(true);
    const deployments_ = await fetchProjectDeployments(projectId, teamId);
    setDeployments(deployments_);
    setIsLoading(false);
  }, [teamId, projectId]);

  useEffect(() => {
    fetchDeployment().catch(err => {
      setError(err instanceof Error ? err : new Error(String(err)));
    });
  }, [fetchDeployment]);

  if (error) {
    throw error;
  }

  return { isLoading, deployments, refresh: fetchDeployment };
};
