import { TextAttributes } from '@opentui/core';
import type { Project } from '@/types/vercel-sdk';

export const LoadingState = ({ project }: { project?: Project }) => (
  <box alignItems='center' flexGrow={1} justifyContent='center'>
    <box alignItems='flex-end' justifyContent='center'>
      <ascii-font font='tiny' text='Loading...' />
      {project ? (
        <text attributes={TextAttributes.DIM} key={project.id}>
          {project.name}
        </text>
      ) : null}
    </box>
  </box>
);
