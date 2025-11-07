import { execSync } from 'node:child_process';
import fs from 'node:fs';
import { createCliRenderer, TextAttributes } from '@opentui/core';
import { createRoot, useKeyboard } from '@opentui/react';
import { useState } from 'react';
import {
  MissingProjectId,
  MissingProjectPath,
} from '@/_components/missing-project';
import { Setup } from '@/_components/setup';
import { hasConfig } from '@/lib/config';
import theme from '@/theme/catppuccin.json' with { type: 'json' };
import { resetVercelInstance } from '@/vercel';
import { Dashboard } from './_components/dashboard';

const projectPath = fs.existsSync('.vercel/project.json')
  ? '.vercel/project.json'
  : null;

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

function HelpPanel() {
  return (
    <box flexDirection='column' flexGrow={1} padding={1}>
      <box alignItems='flex-end' justifyContent='flex-start' marginBottom={1}>
        <ascii-font font='tiny' text='Nivalis Vercel TUI' />
      </box>

      <box border flexDirection='column' flexGrow={1} title='Help'>
        <box flexDirection='column' gap={1} padding={2}>
          <box flexDirection='column' marginBottom={1}>
            <text attributes={TextAttributes.BOLD}>About</text>
            <text attributes={TextAttributes.DIM}>
              Terminal UI for managing Vercel deployments
            </text>
          </box>

          <box flexDirection='column' marginBottom={1}>
            <text attributes={TextAttributes.BOLD}>Global Shortcuts</text>
            <text attributes={TextAttributes.DIM}>? Show this help</text>
            <text attributes={TextAttributes.DIM}>
              Q / ESC Quit application
            </text>
            <text attributes={TextAttributes.DIM}>Ctrl+K Toggle console</text>
          </box>

          <box flexDirection='column' marginBottom={1}>
            <text attributes={TextAttributes.BOLD}>Deployments List</text>
            <text attributes={TextAttributes.DIM}>
              ↑ / ↓ Navigate deployments
            </text>
            <text attributes={TextAttributes.DIM}>
              TAB Cycle branch filter forward
            </text>
            <text attributes={TextAttributes.DIM}>
              Shift+TAB Cycle branch filter backward
            </text>
            <text attributes={TextAttributes.DIM}>
              ENTER View deployment details
            </text>
            <text attributes={TextAttributes.DIM}>
              O Open in Vercel dashboard
            </text>
            <text attributes={TextAttributes.DIM}>R Refresh deployments</text>
          </box>

          <box flexDirection='column'>
            <text attributes={TextAttributes.BOLD}>Deployment Details</text>
            <text attributes={TextAttributes.DIM}>
              BACKSPACE Go back to list
            </text>
            <text attributes={TextAttributes.DIM}>
              O Open in Vercel dashboard
            </text>
          </box>

          <box marginTop={2}>
            <text attributes={TextAttributes.DIM}>
              Press ? or ESC to close this help
            </text>
          </box>
        </box>
      </box>
    </box>
  );
}

function App() {
  const [showHelp, setShowHelp] = useState(false);
  const [isConfigured, setIsConfigured] = useState(hasConfig());

  useKeyboard(key => {
    if (key.name === '?') {
      setShowHelp(prev => !prev);
      return;
    }

    if (showHelp && key.name === 'escape') {
      setShowHelp(false);
      return;
    }

    if (key.ctrl && key.name === 'k') {
      renderer?.console.toggle();
    }

    if (key.name === 'escape' || key.name === 'q') {
      process.exit(0);
    }
  });

  if (!isConfigured) {
    return (
      <Setup
        onComplete={() => {
          resetVercelInstance();
          setIsConfigured(true);
        }}
      />
    );
  }

  if (showHelp) {
    return <HelpPanel />;
  }

  if (!projectPath) {
    return <MissingProjectPath />;
  }

  const { projectId, orgId } = JSON.parse(
    fs.readFileSync(projectPath, 'utf8'),
  ) as { projectId: string; orgId: string };

  if (!(projectId && orgId)) {
    return <MissingProjectId />;
  }

  return (
    <Dashboard
      currentBranch={currentBranch}
      projectId={projectId}
      teamId={orgId}
    />
  );
}

createRoot(renderer).render(<App />);
