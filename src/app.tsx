import { Loading } from '@/_components/loading';
import { useCtx } from '@/ctx';
import { ModalWrapper } from './_components/modal-wrapper';
import { useCommands } from './hooks/use-commands';

export const ConfiguredApp = () => {
  const { content, error, projects, project, modal } = useCtx();
  useCommands();

  if (error) {
    throw error;
  }

  if (projects === null) {
    return <Loading label='Loading projets...' />;
  }

  if (!projects.length) {
    // TODO: maybe allow to create a project ?
    throw new Error('No projects found for this config');
  }

  if (!project) {
    // TODO: if !project we should display project switcher to set one
    throw new Error('No project was selected');
  }

  return (
    <box
      flexDirection='column'
      flexGrow={1}
      style={{ position: 'relative', minHeight: 0 }}
    >
      {modal ? <ModalWrapper {...modal} /> : null}
      {content}
    </box>
  );
};
