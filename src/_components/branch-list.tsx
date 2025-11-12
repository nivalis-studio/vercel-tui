import { getCreatedAt, getStatusInfo } from '@/lib/extract-deploy-details';
import { getTimeAgo } from '@/lib/time-ago';
import { THEME } from '@/theme';
import { ScrollSelect, type ScrollSelectProps } from './scroll-select';
import type { Deployment } from '@/types/vercel-sdk';

type Props = {
  branches: Array<[string, Deployment]>;
  selectedBranch: string;
  onSelectBranch: (branch: string) => void;
} & Pick<ScrollSelectProps, 'focused' | 'getFocus'>;

export const BranchList = ({
  branches,
  selectedBranch,
  onSelectBranch,
  ...props
}: Props) => {
  return (
    <ScrollSelect
      {...props}
      onSelect={idx => {
        const branch = branches[idx]?.at(0);

        if (!branch) {
          return;
        }

        onSelectBranch(branch as string);
      }}
      rows={branches.map(([branch, lastDeployment]) => {
        const isSelected = branch === selectedBranch;
        const relativeTime = getTimeAgo(getCreatedAt(lastDeployment), {
          short: true,
        });

        const { icon, fg } = getStatusInfo(lastDeployment);

        return (
          <box flexDirection='row' gap={1} key={branch} width='100%'>
            {isSelected ? (
              <text flexShrink={0}>{'  '}*</text>
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
      title='Branches'
      width='25%'
    />
  );
};
