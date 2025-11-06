import { useEffect, useState } from 'react';
import { vercel } from '@/vercel';
import type { Deployments } from '@/types/vercel-sdk';

type Props = {
  teamId: string;
  projectId: string;
};

export const useDeployments = ({ teamId, projectId }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasFailed, setHasFailed] = useState(false);
  const [deployments, setDeployments] = useState<Deployments>([]);

  useEffect(() => {
    const fetchDeployment = async () => {
      const response = await vercel.deployments.getDeployments({
        teamId,
        projectId,
      });
      setDeployments(response.deployments);
      setIsLoading(false);
      setHasFailed(false);
    };

    fetchDeployment().catch(error => {
      console.error(error);
      setHasFailed(true);
    });
  }, [teamId, projectId]);

  return { isLoading, deployments, hasFailed };
};
