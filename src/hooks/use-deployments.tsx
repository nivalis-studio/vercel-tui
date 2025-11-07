import { useCallback, useEffect, useState } from 'react';
import { getVercel } from '@/vercel';
import type { Deployments } from '@/types/vercel-sdk';

type Props = {
  teamId: string;
  projectId: string;
};

export const useDeployments = ({ teamId, projectId }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasFailed, setHasFailed] = useState(false);
  const [deployments, setDeployments] = useState<Deployments>([]);

  const fetchDeployment = useCallback(async () => {
    setIsLoading(true);
    setHasFailed(false);
    try {
      const vercel = getVercel();
      const response = await vercel.deployments.getDeployments({
        teamId,
        projectId,
        limit: 100,
      });
      setDeployments(response.deployments);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setHasFailed(true);
      setIsLoading(false);
    }
  }, [teamId, projectId]);

  useEffect(() => {
    fetchDeployment().catch(() => {
      /* */
    });
  }, [fetchDeployment]);

  return { isLoading, deployments, hasFailed, refresh: fetchDeployment };
};
