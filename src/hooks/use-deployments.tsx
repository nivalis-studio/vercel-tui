import { useCallback, useEffect, useState } from 'react';
import { useCtx } from '@/ctx';
import { fetchProjectDeployments } from '@/lib/deployments';
import type { Deployments } from '@/types/vercel-sdk';

const REFETCH_INTERVAL_MS = 10_000;

export const useDeployments = (projectId: string) => {
  const { teamId, setLastError } = useCtx();
  const [isLoading, setIsLoading] = useState(true);
  const [deployments, setDeployments] = useState<Deployments>([]);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<number | null>(null);

  const fetchDeployment = useCallback(async () => {
    setIsLoading(true);

    try {
      const deployments_ = await fetchProjectDeployments(projectId, teamId);
      setDeployments(deployments_);
      setLastRefreshedAt(Date.now());
    } finally {
      setIsLoading(false);
    }
  }, [teamId, projectId]);

  const handleErr = useCallback(
    (err: unknown) => {
      setLastError(err instanceof Error ? err : new Error(String(err)));
    },
    [setLastError],
  );

  useEffect(() => {
    fetchDeployment().catch(handleErr);

    const interval = setInterval(
      () => fetchDeployment().catch(handleErr),
      REFETCH_INTERVAL_MS,
    );

    return () => clearInterval(interval);
  }, [fetchDeployment, handleErr]);

  return {
    isLoading: isLoading && !deployments.length,
    isRefreshing: isLoading && deployments.length > 0,
    deployments,
    lastRefreshedAt,
    refresh: fetchDeployment,
  };
};
