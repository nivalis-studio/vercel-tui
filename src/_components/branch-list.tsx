import { useKeyboard } from '@opentui/react';
import { useState } from 'react';
import { getCreatedAt, getStatusInfo } from '@/lib/extract-deploy-details';
import { getTimeAgo } from '@/lib/time-ago';
import { THEME } from '@/theme';
import type { Deployment } from '@/types/vercel-sdk';

export const BranchList = ({
  branches,
  selectedBranch,
  onSelectBranch,
  focused = true,
}: {
  branches: Array<[string, Deployment]>;
  selectedBranch: string;
  onSelectBranch: (branch: string) => void;
  focused: boolean;
}) => {
  const [hoveredIdx, setHoveredIdx] = useState(
    branches.findIndex(([b]) => b === selectedBranch) || 0,
  );

  useKeyboard(key => {
    if (!focused) {
      return;
    }

    if (key.name === 'down' || key.name === 'j') {
      setHoveredIdx(i => (i + 1) % branches.length);
    }

    if (key.name === 'up' || key.name === 'k') {
      setHoveredIdx(i => (i - 1 + branches.length) % branches.length);
    }

    if (key.name === 'enter') {
      // biome-ignore lint/style/noNonNullAssertion: .
      const [branch] = branches[hoveredIdx]!;
      onSelectBranch(branch);
    }
  });

  return (
    <box
      borderColor={focused ? THEME.defs.darkBlue : THEME.defs.darkSurface2}
      borderStyle='rounded'
      flexDirection='column'
      height='100%'
      padding={1}
      title='Branches'
      width='25%'
    >
      <box flexDirection='column' flexGrow={1} overflow='scroll'>
        {branches.map(([branch, lastDeployment], idx) => {
          const isSelected = branch === selectedBranch;
          const isHovered = hoveredIdx === idx;
          const relativeTime = getTimeAgo(getCreatedAt(lastDeployment), {
            short: true,
          });

          const { icon, fg } = getStatusInfo(lastDeployment);

          return (
            <box
              backgroundColor={isHovered ? THEME.defs.darkSurface0 : undefined}
              flexDirection='row'
              gap={1}
              key={branch}
              width='100%'
            >
              {isSelected ? (
                <text
                  fg={isSelected ? THEME.defs.darkGreen : undefined}
                  flexShrink={0}
                >
                  {'  '}*
                </text>
              ) : (
                <text fg={THEME.defs.darkTeal} flexShrink={0}>
                  {relativeTime.length < 3 && ' '}
                  {relativeTime}
                </text>
              )}
              <text fg={fg} flexShrink={0}>
                {icon}
              </text>
              <text wrapMode='none'>{branch}</text>
            </box>
          );
        })}
      </box>
    </box>
  );
};
