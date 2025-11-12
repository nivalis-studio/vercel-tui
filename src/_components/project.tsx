import { useMemo, useState } from 'react';
import { useCtx } from '@/app';
import { useDeployments } from '@/hooks/use-deployments';
import { getBranch, getCreatedAt } from '@/lib/extract-deploy-details';
import { BranchList } from './branch-list';
import { Loading } from './loading';
import type { Deployment } from '@/types/vercel-sdk';

const getBranchesList = (deployments: Array<Deployment>) => {
  const map = new Map<string, number>();
  let lastUpdatedAt: number | undefined;

  for (const deployment of deployments) {
    const branch = getBranch(deployment);

    if (!branch) {
      continue;
    }

    const createdAt = getCreatedAt(deployment);

    const latest = map.get(branch);

    if (!lastUpdatedAt || createdAt < lastUpdatedAt) {
      lastUpdatedAt = createdAt;
    }

    if (!latest || createdAt > latest) {
      map.set(branch, createdAt);
    }
  }

  const sortedBranches = Array.from(map.entries()).sort(
    ([bA, createdA], [bB, createdB]) =>
      createdB - createdA || bA.localeCompare(bB),
  );

  return [['All', lastUpdatedAt], ...sortedBranches];
};

export const ProjectDashboard = () => {
  const { project } = useCtx();
  const { isLoading, deployments } = useDeployments(project.id);
  const [selectedBranch, setSelectedBranch] = useState<string>('All');

  const branches = useMemo(() => {
    return getBranchesList(deployments);
  }, [deployments]);

  if (isLoading) {
    return <Loading label='Loading deployments...' />;
  }

  return (
    <box flexDirection='row' height='100%' width='100%'>
      <BranchList
        branches={branches}
        onSelectBranch={setSelectedBranch}
        selectedBranch={selectedBranch}
      />
      <box flexGrow={1}>
        <text>Middle section - Selected: {selectedBranch}</text>
      </box>
      <box flexGrow={1}>
        <text>Right section</text>
      </box>
    </box>
  );
};
