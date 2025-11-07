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
  currentBranch?: string;
};

export const Dashboard = ({ teamId, projectId, currentBranch }: Props) => {
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
      currentBranch={currentBranch}
      deployments={deployments}
      project={project}
      teamId={teamId}
    />
  );
};
