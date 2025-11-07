/** biome-ignore-all lint/style/noMagicNumbers: yay */

import { type ScrollBoxRenderable, TextAttributes } from '@opentui/core';
import { useKeyboard } from '@opentui/react';
import open from 'open';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getBranch, getCreatedAt } from '@/lib/extract-deploy-details';
import theme from '@/theme/catppuccin.json' with { type: 'json' };
import { DeploymentDetails } from './deployment-details';
import { TableHeader } from './table/header';
import { TableRows } from './table/rows';
import type { Deployment, Deployments, Project } from '@/types/vercel-sdk';

type Props = {
  project: Project;
  deployments: Deployments;
  teamId: string;
  currentBranch?: string;
  refresh: () => Promise<void>;
  selectedBranchIndex: number;
  setSelectedBranchIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedDeploymentIndex: number;
  setSelectedDeploymentIndex: React.Dispatch<React.SetStateAction<number>>;
  viewingDeployment: Deployment | undefined;
  setViewingDeployment: React.Dispatch<
    React.SetStateAction<Deployment | undefined>
  >;
};

export const DeploymentsList = ({
  deployments,
  project,
  teamId,
  refresh,
  selectedBranchIndex,
  setSelectedBranchIndex,
  selectedDeploymentIndex,
  setSelectedDeploymentIndex,
  viewingDeployment,
  setViewingDeployment,
}: Props) => {
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

  const asciiBoxWidth = Math.max(project.name.length * 4, 24);

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

  const scrollboxRef = useRef<ScrollBoxRenderable | null>(null);
  const branchScrollRef = useRef<ScrollBoxRenderable | null>(null);
  const [verticalScrollbarWidth, setVerticalScrollbarWidth] = useState(0);
  const bodyPaddingLeft = 1;
  const bodyPaddingRight = bodyPaddingLeft + verticalScrollbarWidth;

  useEffect(() => {
    setSelectedDeploymentIndex(prev => {
      if (sorted.length === 0) {
        return 0;
      }
      const maxIndex = sorted.length - 1;
      return prev > maxIndex ? maxIndex : prev;
    });
  }, [sorted.length, setSelectedDeploymentIndex]);

  useEffect(() => {
    const scrollbox = scrollboxRef.current;
    if (!scrollbox) {
      setVerticalScrollbarWidth(0);
      return;
    }

    const currentScrollbarWidth = scrollbox.verticalScrollBar?.visible
      ? (scrollbox.verticalScrollBar.width ?? 0)
      : 0;

    setVerticalScrollbarWidth(prev =>
      prev === currentScrollbarWidth ? prev : currentScrollbarWidth,
    );

    if (sorted.length === 0) {
      scrollbox.scrollTo(0);
      return;
    }

    const rows = scrollbox.getChildren();
    if (!rows.length) {
      scrollbox.scrollTop = 0;
      return;
    }

    const rowIndex = Math.min(selectedDeploymentIndex, rows.length - 1);
    if (rowIndex < 0) {
      scrollbox.scrollTop = 0;
      return;
    }

    const row = rows[rowIndex];
    if (!row) {
      return;
    }

    const viewportHeight = scrollbox.viewport.height;
    if (!viewportHeight) {
      return;
    }

    const rowTop = row.y - scrollbox.content.y;
    const rowBottom = rowTop + row.height;
    const currentScrollTop = scrollbox.scrollTop;
    const maxScrollTop = Math.max(0, scrollbox.scrollHeight - viewportHeight);

    if (rowTop < currentScrollTop) {
      scrollbox.scrollTop = Math.max(0, rowTop);
    } else if (rowBottom > currentScrollTop + viewportHeight) {
      const target = Math.min(
        maxScrollTop,
        Math.max(0, rowBottom - viewportHeight),
      );
      scrollbox.scrollTop = target;
    }
  }, [selectedDeploymentIndex, sorted.length]);

  useEffect(() => {
    const branchScroll = branchScrollRef.current;
    if (!branchScroll) {
      return;
    }

    const tabs = branchScroll.getChildren();
    if (!tabs.length) {
      branchScroll.scrollLeft = 0;
      return;
    }

    const tabIndex = Math.min(selectedBranchIndex, tabs.length - 1);
    if (tabIndex < 0) {
      branchScroll.scrollLeft = 0;
      return;
    }

    const tab = tabs[tabIndex];
    if (!tab) {
      return;
    }

    const viewportWidth = branchScroll.viewport.width;
    if (!viewportWidth) {
      return;
    }

    const tabLeft = tab.x - branchScroll.content.x;
    const tabRight = tabLeft + tab.width;
    const currentScrollLeft = branchScroll.scrollLeft;
    const maxScrollLeft = Math.max(0, branchScroll.scrollWidth - viewportWidth);

    if (tabLeft < currentScrollLeft) {
      branchScroll.scrollLeft = Math.max(0, tabLeft - 1);
    } else if (tabRight > currentScrollLeft + viewportWidth) {
      const target = Math.min(
        maxScrollLeft,
        Math.max(0, tabRight - viewportWidth + 1),
      );
      branchScroll.scrollLeft = target;
    }
  }, [selectedBranchIndex]);

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: okay-ish
  useKeyboard(key => {
    if (viewingDeployment) {
      if (key.name === 'backspace') {
        setViewingDeployment(undefined);
      }
      return;
    }

    if (key.name === 'tab') {
      if (key.shift) {
        setSelectedBranchIndex(
          prev => (prev - 1 + branches.length) % branches.length,
        );
      } else {
        setSelectedBranchIndex(prev => (prev + 1) % branches.length);
      }
      setSelectedDeploymentIndex(0);
    } else if (key.name === 'up') {
      setSelectedDeploymentIndex(prev => Math.max(0, prev - 1));
    } else if (key.name === 'down') {
      setSelectedDeploymentIndex(prev => Math.min(sorted.length - 1, prev + 1));
    } else if (key.name === 'return') {
      const selectedDeployment = sorted[selectedDeploymentIndex];
      if (selectedDeployment) {
        setViewingDeployment(selectedDeployment);
      }
    } else if (key.name === 'o') {
      const selectedDeployment = sorted[selectedDeploymentIndex];
      if (selectedDeployment) {
        const url = `https://vercel.com/${teamId}/${project.name}/${selectedDeployment.uid}`;
        open(url).catch(err => console.error(err));
      }
    } else if (key.name === 'r') {
      refresh().catch(err => console.error(err));
    }
  });

  if (viewingDeployment) {
    return (
      <DeploymentDetails
        deployment={viewingDeployment}
        project={project}
        teamId={teamId}
      />
    );
  }

  return (
    <box
      flexDirection='column'
      flexGrow={1}
      padding={1}
      style={{ height: '100%', minHeight: 0 }}
    >
      <box alignItems='center' flexDirection='row' gap={1} marginBottom={1}>
        <scrollbox
          ref={branchScrollRef}
          scrollX
          scrollY={false}
          style={{
            rootOptions: {
              flexGrow: 1,
              height: 3,
            },
            wrapperOptions: {
              backgroundColor: 'transparent',
              height: 3,
            },
            viewportOptions: {
              backgroundColor: 'transparent',
              height: 3,
            },
            contentOptions: {
              flexDirection: 'row',
              gap: 1,
              alignItems: 'center',
              paddingLeft: 1,
              paddingRight: 1,
            },
            scrollbarOptions: {
              showArrows: false,
              trackOptions: {
                foregroundColor: theme.defs.darkBlue,
                backgroundColor: theme.defs.darkSurface0,
              },
            },
          }}
        >
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
        </scrollbox>
        <box alignItems='flex-end' style={{ width: asciiBoxWidth }}>
          <ascii-font font='tiny' text={project.name} />
        </box>
      </box>

      <box
        border
        flexDirection='column'
        flexGrow={1}
        style={{ minHeight: 0, height: '100%' }}
        title='Deployments'
      >
        <TableHeader
          bodyPaddingLeft={bodyPaddingLeft}
          bodyPaddingRight={bodyPaddingRight}
        />

        <TableRows
          bodyPaddingLeft={bodyPaddingLeft}
          bodyPaddingRight={bodyPaddingRight}
          deployments={deployments}
          scrollboxRef={scrollboxRef}
          selectedBranch={selectedBranch}
          selectedDeploymentIndex={selectedDeploymentIndex}
        />
      </box>
    </box>
  );
};
