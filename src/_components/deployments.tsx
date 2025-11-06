import { TextAttributes } from '@opentui/core';
import type { Deployments, Project } from '@/types/vercel-sdk';

type Props = {
  project: Project;
  deployments: Deployments;
};

export const DeploymentsList = ({ deployments, project }: Props) => {
  return (
    <box alignItems='center' flexGrow={1} justifyContent='center'>
      <box alignItems='flex-end' justifyContent='center'>
        <ascii-font font='tiny' text={project.name} />
        {deployments.map(deployment => (
          <text attributes={TextAttributes.DIM} key={deployment.uid}>
            {deployment.url}
          </text>
        ))}
      </box>
    </box>
  );
};
