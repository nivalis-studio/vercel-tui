import { TextAttributes } from '@opentui/core';
import { useKeyboard } from '@opentui/react';
import { useMemo } from 'react';
import { QUITTING_KEYS } from '@/constants';
import { useCtx } from '@/ctx';
import { ScrollSelect } from './scroll-select';

export const ProjectSwitcher = () => {
  const {
    projectId: currentProjectId,
    projects,
    setProjectId,
    setModal,
  } = useCtx();
  const sortedProjects = useMemo(
    () =>
      [...(projects ?? [])].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
      ),
    [projects],
  );

  const onSelect = (idx: number) => {
    const project = sortedProjects[idx];
    if (!project) {
      return;
    }

    setProjectId(project.id);
    setModal(null);
  };

  useKeyboard(key => {
    if (QUITTING_KEYS.includes(key.name)) {
      setModal(null);
    }
  });

  return (
    <ScrollSelect
      onSelect={onSelect}
      rows={sortedProjects.map(project => (
        <box
          alignItems='center'
          flexDirection='row'
          justifyContent='space-between'
          key={project.id}
        >
          <text
            attributes={
              project.id === currentProjectId
                ? TextAttributes.INVERSE
                : TextAttributes.BOLD
            }
          >
            {project.name}
          </text>
          {project.id === currentProjectId ? (
            <text attributes={TextAttributes.DIM}>Current</text>
          ) : null}
          <text attributes={TextAttributes.DIM}>{project.id}</text>
        </box>
      ))}
      title='Switch project'
    />
  );
};
