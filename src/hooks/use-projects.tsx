import { useEffect, useState } from 'react';
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
      const url = `https://api.vercel.com/v9/projects/${projectId}`;
      const options = {
        method: 'GET',
        headers: { Authorization: 'Bearer jArwVRv3eOITMt3fbn959KCw' },
        body: undefined,
      };

      try {
        const response = await fetch(url, options);
        const data = (await response.json()) as Project;
        setProject(data);
        setIsLoading(false);
        setHasFailed(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProject().catch(error => {
      console.error(error);
      setHasFailed(true);
    });
  }, [projectId]);

  return { isLoading, project, hasFailed };
};
