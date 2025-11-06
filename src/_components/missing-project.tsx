import { TextAttributes } from '@opentui/core';

export const MissingProjectPath = () => (
  <box alignItems='center' flexGrow={1} justifyContent='center'>
    <box alignItems='flex-end' justifyContent='center'>
      <ascii-font font='tiny' text='Error 404' />
      <text attributes={TextAttributes.DIM}>
        Could not find project config...
      </text>
      <text attributes={TextAttributes.DIM}>
        try running `vercel link` maybe
      </text>
    </box>
  </box>
);

export const MissingProjectId = () => (
  <box alignItems='center' flexGrow={1} justifyContent='center'>
    <box alignItems='flex-end' justifyContent='center'>
      <ascii-font font='tiny' text='Error 404' />
      <text attributes={TextAttributes.DIM}>
        Could not find project or organization ID...
      </text>
      <text attributes={TextAttributes.DIM}>
        try running `vercel link` maybe
      </text>
    </box>
  </box>
);

export const LoadingProjectError = () => (
  <box alignItems='center' flexGrow={1} justifyContent='center'>
    <box alignItems='flex-end' justifyContent='center'>
      <ascii-font font='tiny' text='Error 500' />
      <text attributes={TextAttributes.DIM}>
        Could not fetch the project...
      </text>
      <text attributes={TextAttributes.DIM}>this might be a network issue</text>
    </box>
  </box>
);

export const LoadingDeploymentsError = () => (
  <box alignItems='center' flexGrow={1} justifyContent='center'>
    <box alignItems='flex-end' justifyContent='center'>
      <ascii-font font='tiny' text='Error 500' />
      <text attributes={TextAttributes.DIM}>
        Could not fetch deployments...
      </text>
      <text attributes={TextAttributes.DIM}>this might be a network issue</text>
    </box>
  </box>
);
