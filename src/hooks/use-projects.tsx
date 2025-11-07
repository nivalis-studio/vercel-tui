import { useEffect, useState } from 'react';
import { getConfig } from '@/lib/config';
import type { Project } from '@/types/vercel-sdk';

type Props = {
  projectId: string;
};

export const useProject = ({ projectId }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasFailed, setHasFailed] = useState(false);
  const [project, setProject] = useState<Project>();

  useEffect(() => {
    const fetchProject = async () => {
      const config = getConfig();
      if (!config?.bearerToken) {
        throw new Error('Bearer token not configured');
      }

      const url = `https://api.vercel.com/v9/projects/${projectId}`;
      const options = {
        method: 'GET',
        headers: { Authorization: `Bearer ${config.bearerToken}` },
        body: undefined,
      };

      const response = await fetch(url, options);
      const data = (await response.json()) as Project;
      setProject(data);
      setIsLoading(false);
      setHasFailed(false);
    };

    fetchProject().catch(error => {
      console.error(error);
      setIsLoading(false);
      setHasFailed(true);
    });
  }, [projectId]);

  return { isLoading, project, hasFailed };
};
