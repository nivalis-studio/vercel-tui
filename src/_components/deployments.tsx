/** biome-ignore-all lint/style/noMagicNumbers: yay */
import { exec } from 'node:child_process';
import { TextAttributes } from '@opentui/core';
import { useKeyboard } from '@opentui/react';
import { useMemo, useState } from 'react';
import { getTimeAgo } from '@/lib/time-ago';
import theme from '@/theme/catppuccin.json' with { type: 'json' };
import type { Deployment, Deployments, Project } from '@/types/vercel-sdk';

type Props = {
  project: Project;
  deployments: Deployments;
  teamId: string;
  currentBranch?: string;
};

const getCreatedAt = (d: Deployment) => d.createdAt ?? d.created;

const formatRelativeTime = (ts: number) => {
  return getTimeAgo(new Date(ts));
};

const getBranch = (d: Deployment) =>
  d.meta?.githubCommitRef ||
  d.meta?.gitlabCommitRef ||
  d.meta?.bitbucketCommitRef ||
  d.meta?.commitRef ||
  d.meta?.branch ||
  '';

const getCommit = (d: Deployment) => {
  const sha =
    d.meta?.githubCommitSha ||
    d.meta?.gitlabCommitSha ||
    d.meta?.bitbucketCommitSha ||
    d.meta?.commitSha ||
    '';
  return sha ? sha.slice(0, 7) : '';
};

const getStatusInfo = (d: Deployment) => {
  const state = d.readyState || d.state || 'UNKNOWN';
  let fg = theme.defs.darkOverlay2;
  if (state === 'READY') {
    fg = theme.defs.darkGreen;
  } else if (
    state === 'BUILDING' ||
    state === 'INITIALIZING' ||
    state === 'QUEUED'
  ) {
    fg = theme.defs.darkYellow;
  } else if (state === 'ERROR' || state === 'CANCELED' || state === 'DELETED') {
    fg = theme.defs.darkRed;
  }
  return { label: state, fg } as const;
};

const truncate = (str: string, len: number) =>
  str.length > len ? `${str.slice(0, Math.max(0, len - 1))}…` : str;

type Column = { label: string; width?: number; flex?: number };

const columns: Array<Column> = [
  { label: 'Time', width: 12 },
  { label: 'Status', width: 12 },
  { label: 'Target', width: 10 },
  { label: 'URL', flex: 1 },
  { label: 'Branch', width: 18 },
  { label: 'Commit', width: 8 },
];

export const DeploymentsList = ({
  deployments,
  project,
  teamId,
  currentBranch,
}: Props) => {
  const [timeCol, statusCol, targetCol, , branchCol, commitCol] = columns as [
    Column,
    Column,
    Column,
    Column,
    Column,
    Column,
  ];

  const branches = useMemo(() => {
    const branchSet = new Set<string>();
    for (const d of deployments) {
      const branch = getBranch(d);
      if (branch) {
        branchSet.add(branch);
      }
    }
    return ['All', ...Array.from(branchSet).sort()];
  }, [deployments]);

  const [selectedBranchIndex, setSelectedBranchIndex] = useState(() => {
    if (currentBranch) {
      const index = branches.indexOf(currentBranch);
      return index >= 0 ? index : 0;
    }
    return 0;
  });

  const selectedBranch = branches[selectedBranchIndex];

  const filtered = useMemo(() => {
    if (selectedBranch === 'All') {
      return deployments;
    }
    return deployments.filter(d => getBranch(d) === selectedBranch);
  }, [deployments, selectedBranch]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => getCreatedAt(b) - getCreatedAt(a)),
    [filtered],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  useKeyboard(key => {
    if (key.name === 'tab') {
      if (key.shift) {
        setSelectedBranchIndex(
          prev => (prev - 1 + branches.length) % branches.length,
        );
      } else {
        setSelectedBranchIndex(prev => (prev + 1) % branches.length);
      }
      setSelectedIndex(0);
    } else if (key.name === 'up') {
      setSelectedIndex(prev => Math.max(0, prev - 1));
    } else if (key.name === 'down') {
      setSelectedIndex(prev => Math.min(sorted.length - 1, prev + 1));
    } else if (key.name === 'return') {
      const selectedDeployment = sorted[selectedIndex];
      if (selectedDeployment) {
        const url = `https://vercel.com/${teamId}/${project.name}/${selectedDeployment.uid}`;
        exec(`open "${url}"`);
      }
    }
  });

  return (
    <box flexDirection='column' flexGrow={1} padding={1}>
      <box flexDirection='row' justifyContent='space-between' marginBottom={1}>
        <box flexDirection='row' gap={1}>
          {branches.map((branch, index) => {
            const isSelected = index === selectedBranchIndex;
            return (
              <box
                key={branch}
                paddingLeft={1}
                paddingRight={1}
                style={{
                  backgroundColor: isSelected ? theme.defs.darkBlue : undefined,
                }}
              >
                <text
                  attributes={isSelected ? TextAttributes.INVERSE : undefined}
                >
                  {branch}
                </text>
              </box>
            );
          })}
        </box>
        <box alignItems='flex-end'>
          <ascii-font font='tiny' text={project.name} />
        </box>
      </box>

      <box border flexDirection='column' flexGrow={1} title='Deployments'>
        {/* Header */}
        <box
          paddingLeft={1}
          paddingRight={1}
          style={{ backgroundColor: '#1f2335' }}
        >
          <box flexDirection='row' gap={2}>
            {columns.map(col => (
              <box
                key={col.label}
                style={{ width: col.width, flexGrow: col.flex ?? 0 }}
              >
                <text attributes={TextAttributes.DIM}>{col.label}</text>
              </box>
            ))}
          </box>
        </box>

        {/* Rows */}
        <box flexDirection='column' gap={0} paddingLeft={1} paddingRight={1}>
          {sorted.map((d, index) => {
            const createdAt = getCreatedAt(d);
            const status = getStatusInfo(d);
            const branch = getBranch(d);
            const commit = getCommit(d);
            const isSelected = index === selectedIndex;

            return (
              <box
                flexDirection='row'
                gap={2}
                key={d.uid}
                style={{
                  backgroundColor: isSelected ? '#2e3440' : undefined,
                }}
              >
                {/* Time */}
                <box style={{ width: timeCol.width }}>
                  <text attributes={TextAttributes.DIM}>
                    {formatRelativeTime(createdAt)}
                  </text>
                </box>

                {/* Status */}
                <box style={{ width: statusCol.width }}>
                  <text fg={status.fg}>{status.label}</text>
                </box>

                {/* Target */}
                <box style={{ width: targetCol.width }}>
                  <text>{d.target ?? ''}</text>
                </box>

                {/* URL */}
                <box style={{ flexGrow: 1 }}>
                  <text>{truncate(d.url, 48)}</text>
                </box>

                {/* Branch */}
                <box style={{ width: branchCol.width }}>
                  <text>{truncate(branch, branchCol.width ?? 18)}</text>
                </box>

                {/* Commit */}
                <box style={{ width: commitCol.width }}>
                  <text attributes={TextAttributes.DIM}>{commit}</text>
                </box>
              </box>
            );
          })}
        </box>
      </box>
    </box>
  );
};
