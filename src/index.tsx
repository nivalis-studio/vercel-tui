#!/usr/bin/env bun
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import { createCliRenderer } from '@opentui/core';
import { createRoot } from '@opentui/react';
import { useState } from 'react';
import { Dashboard } from '@/_components/dashboard';
import { HelpPanel } from '@/_components/help';
import {
  MissingProjectId,
  MissingProjectPath,
} from '@/_components/missing-project';
import { Setup } from '@/_components/setup';
import { hasConfig } from '@/lib/config';
import theme from '@/theme/catppuccin.json' with { type: 'json' };
import { resetVercelInstance } from '@/vercel';
import { useShortcuts } from './hooks/use-shortcuts';

const PROJECT_CONFIG_PATH = '.vercel/project.json';

type ProjectConfigState =
  | { status: 'missing_path' }
  | { status: 'missing_id' }
  | { status: 'ready'; projectId: string; teamId: string }
  | { status: 'error'; message: string };

const readProjectConfig = (): ProjectConfigState => {
  try {
    const contents = fs.readFileSync(PROJECT_CONFIG_PATH, 'utf8');
    const { projectId, orgId } = JSON.parse(contents) as {
      projectId?: string;
      orgId?: string;
    };

    if (projectId && orgId) {
      return { status: 'ready', projectId, teamId: orgId };
    }

    return { status: 'missing_id' };
  } catch (error) {
    const err = error as NodeJS.ErrnoException;

    if (err.code === 'ENOENT') {
      return { status: 'missing_path' };
    }

    console.error('Failed to read project config:', error);
    return { status: 'error', message: err.message };
  }
};

function useProjectConfig() {
  const [state, setState] = useState<ProjectConfigState>(() =>
    readProjectConfig(),
  );

  const refresh = () => {
    setState(readProjectConfig());
  };

  return { state, refresh };
}

const getCurrentBranch = (): string | undefined => {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return;
  }
};

const currentBranch = getCurrentBranch();

const renderer = await createCliRenderer({
  backgroundColor: theme.defs.darkBase,
});

function App() {
  const [isConfigured, setIsConfigured] = useState(hasConfig());
  const { state: projectConfig, refresh: refreshProject } = useProjectConfig();
  const { showHelp } = useShortcuts({ renderer, enabled: isConfigured });

  if (!isConfigured) {
    return (
      <Setup
        onComplete={() => {
          resetVercelInstance();
          refreshProject();
          setIsConfigured(true);
        }}
      />
    );
  }

  if (showHelp) {
    return <HelpPanel />;
  }

  switch (projectConfig.status) {
    case 'missing_path':
      return <MissingProjectPath />;
    case 'missing_id':
    case 'error':
      return <MissingProjectId />;
    case 'ready':
      return (
        <Dashboard
          currentBranch={currentBranch}
          projectId={projectConfig.projectId}
          teamId={projectConfig.teamId}
        />
      );
    default:
      return <MissingProjectPath />;
  }
}

createRoot(renderer).render(<App />);
