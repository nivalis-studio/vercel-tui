import { getTimeAgo } from '@/lib/time-ago';
import { THEME } from '@/theme';

export const BranchList = ({
  branches,
  selectedBranch,
  onSelectBranch,
}: {
  branches: Array<[string, number]>;
  selectedBranch: string;
  onSelectBranch: (branch: string) => void;
}) => {
  return (
    <box
      borderStyle='rounded'
      flexDirection='column'
      height='100%'
      style={{ paddingLeft: 1, paddingRight: 1 }}
      width='20%'
    >
      <text>
        <strong>Branches</strong>
      </text>
      <box flexDirection='column' flexGrow={1} overflow='scroll'>
        {branches.map(([branch, lastDeployementAt]) => {
          const isSelected = branch === selectedBranch;
          const relativeTime = getTimeAgo(lastDeployementAt, { short: true });

          return (
            <box
              backgroundColor={isSelected ? THEME.defs.darkSurface0 : undefined}
              flexDirection='row'
              gap={1}
              key={branch}
              onPress={() => onSelectBranch(branch)}
              width='100%'
            >
              {isSelected ? (
                <text
                  fg={isSelected ? THEME.defs.darkGreen : undefined}
                  flexShrink={0}
                >
                  {' '}
                  ✓
                </text>
              ) : (
                <text fg={THEME.defs.darkTeal} flexShrink={0}>
                  {relativeTime}
                </text>
              )}
              <text wrapMode='none'>{branch}</text>
            </box>
          );
        })}
      </box>
    </box>
  );
};
