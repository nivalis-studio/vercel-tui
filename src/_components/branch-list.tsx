import { getCreatedAt, getStatusInfo } from '@/lib/extract-deploy-details';
import { getTimeAgo } from '@/lib/time-ago';
import { THEME } from '@/theme';
import type { Deployment } from '@/types/vercel-sdk';

export const BranchList = ({
  branches,
  selectedBranch,
}: {
  branches: Array<[string, Deployment]>;
  selectedBranch: string;
  onSelectBranch: (branch: string) => void;
}) => {
  return (
    <box
      borderStyle='rounded'
      flexDirection='column'
      height='100%'
      style={{ paddingLeft: 1, paddingRight: 1 }}
      width='25%'
    >
      <text>
        <strong>Branches</strong>
      </text>
      <box flexDirection='column' flexGrow={1} overflow='scroll'>
        {branches.map(([branch, lastDeployment]) => {
          const isSelected = branch === selectedBranch;
          const relativeTime = getTimeAgo(getCreatedAt(lastDeployment), {
            short: true,
          });

          const { icon, fg } = getStatusInfo(lastDeployment);

          return (
            <box
              backgroundColor={isSelected ? THEME.defs.darkSurface0 : undefined}
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
                  {' '}
                  *
                </text>
              ) : (
                <text fg={THEME.defs.darkTeal} flexShrink={0}>
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
