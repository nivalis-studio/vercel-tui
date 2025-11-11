/** biome-ignore-all lint/nursery/noImportCycles: . */
import { useCtx } from '@/app';
import { useDeployments } from '@/hooks/use-deployments';
import { Loading } from './loading';

export const ProjectDashboard = () => {
  const { project } = useCtx();
  const { isLoading } = useDeployments(project.id);

  if (isLoading) {
    return (
      <Loading label={`Loading deployments for project ${project.name} `} />
    );
  }

  return <text>project dashboard : {project.name}</text>;
};
