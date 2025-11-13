import type { ReactNode } from 'react';
import type { Theme } from '@/lib/colors';
import type { Project, Projects } from '@/types/vercel-sdk';

export type Ctx = {
  modal: ReactNode;
  setModal: (modal: ReactNode) => void;
  error: Error | null;
  projectId: string;
  setProjectId: (projectId: string) => void;
  projects: Projects | null;
  refreshProjects: () => Promise<void>;
  project: Project;
  teamId: string;
  getColor: (color: keyof Theme['theme']) => string;
  /** Always use `ctx.getColor` when possible */
  _internal_theme: Theme;
};
