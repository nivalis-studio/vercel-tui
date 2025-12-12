import { Loading } from '@/_components/loading';
import {
  NoProjectSelected,
  NoProjectsFound,
} from '@/_components/missing-project';
import { useCtx } from '@/ctx';
import { ModalWrapper } from './_components/modal-wrapper';
import { useCommands } from './hooks/use-commands';

export const ConfiguredApp = () => {
  const { content, getColor, lastError, projects, project, modal } = useCtx();
  useCommands();

  let body = content;

  if (projects === null) {
    body = lastError ? (
      <box alignItems='center' flexGrow={1} justifyContent='center'>
        <box
          borderColor={getColor('error')}
          borderStyle='rounded'
          flexDirection='column'
          gap={1}
          style={{
            paddingLeft: 2,
            paddingRight: 2,
            paddingTop: 1,
            paddingBottom: 1,
            maxWidth: 100,
            width: '70%',
          }}
        >
          <text fg={getColor('error')} wrapMode='word'>
            Failed to load projects: {lastError.message}
          </text>
          <text fg={getColor('textMuted')} wrapMode='word'>
            Ctrl+R retry, Ctrl+E details
          </text>
        </box>
      </box>
    ) : (
      <Loading label='Loading projects...' />
    );
  } else if (projects.length === 0) {
    body = <NoProjectsFound />;
  } else if (project === null) {
    body = <NoProjectSelected />;
  }

  return (
    <box
      flexDirection='column'
      flexGrow={1}
      style={{ position: 'relative', minHeight: 0 }}
    >
      {modal ? <ModalWrapper {...modal} /> : null}
      {body}
    </box>
  );
};
