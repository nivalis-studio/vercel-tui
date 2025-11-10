import { createContext, type ReactNode, useContext, useState } from 'react';
import { getProjectConfig, type ProjectConfig } from './lib/config';
import type { Projects } from './types/vercel-sdk';

type Ctx = {
  setContent: (content: ReactNode) => void;
  setModal: (modal: ReactNode) => void;
  projectId: string;
  setProjectId: (projectId: string) => void;
  projects: Projects;
  config: ProjectConfig;
};

const ctx = createContext<Ctx | null>(null);

export const ConfiguredApp = () => {
  const config = getProjectConfig();
  const [content, setContent] = useState<ReactNode>(null);
  const [modal, setModal] = useState<ReactNode>(null);
  const [projectId, setProjectId] = useState(config.projectId);
  const [projects, setProjects] = useState<Projects>([]);

  const ctx_: Ctx = {
    setContent,
    projectId,
    setProjectId,
    setModal,
    config,
    projects,
  };

  return (
    <ctx.Provider value={ctx_}>
      <box
        flexDirection='column'
        flexGrow={1}
        style={{ position: 'relative', minHeight: 0 }}
      >
        {modal}
        {content}
      </box>
    </ctx.Provider>
  );
};

export const useCtx = () => {
  const context = useContext(ctx);

  if (!context) {
    throw new Error('useCtx must be used within ctx provider');
  }

  return context;
};
