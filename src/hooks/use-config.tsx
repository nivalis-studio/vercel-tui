import fs from 'node:fs';
import { useState } from 'react';

const PROJECT_CONFIG_PATH = '.vercel/project.json';

export type ProjectConfigState = { projectId: string; teamId: string };

const readProjectConfig = (): ProjectConfigState => {
  let content: string;
  let projectId: string | undefined;
  let orgId: string | undefined;

  try {
    content = fs.readFileSync(PROJECT_CONFIG_PATH, 'utf8');
  } catch (error) {
    throw new Error(
      'Could not read the project config. Try running `vercel link`',
      { cause: error },
    );
  }

  try {
    const json = JSON.parse(content) as {
      projectId?: string;
      orgId?: string;
    };

    projectId = json.projectId;
    orgId = json.orgId;
  } catch (error) {
    throw new Error(
      'Could not parse the project config. Try running `vercel link`',
      { cause: error },
    );
  }

  if (projectId && orgId) {
    return { projectId, teamId: orgId };
  }

  throw new Error(
    'Could not find project or organization ID. Try running `vercel link`',
  );
};

export function useProjectConfig() {
  const [state, setState] = useState<ProjectConfigState>(() =>
    readProjectConfig(),
  );

  const refresh = () => {
    setState(readProjectConfig());
  };

  return { state, refresh };
}
