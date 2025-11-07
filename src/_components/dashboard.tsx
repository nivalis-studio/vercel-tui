import { useDeployments } from '@/hooks/use-deployments';
import { useProject } from '@/hooks/use-projects';
import { DeploymentsList } from './deployments';
import { LoadingState } from './loading';
import {
  LoadingDeploymentsError,
  LoadingProjectError,
} from './missing-project';

type Props = {
  teamId: string;
  projectId: string;
};

export const Dashboard = ({ teamId, projectId }: Props) => {
  const { hasFailed: hasFailedProject, project } = useProject({ projectId });
  const { hasFailed: hasFailedDeployments, deployments } = useDeployments({
    teamId,
    projectId,
  });

  if (hasFailedProject) {
    return <LoadingProjectError />;
  }

  if (hasFailedDeployments) {
    return <LoadingDeploymentsError />;
  }

  if (!(deployments && project)) {
    return <LoadingState project={project} />;
  }

  return (
    <DeploymentsList
      deployments={deployments}
      project={project}
      teamId={teamId}
    />
  );
};
