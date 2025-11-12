import { useKeyboard } from '@opentui/react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { THEME } from '@/theme';
import type { BoxOptions, ScrollBoxRenderable } from '@opentui/core';

export type ScrollSelectProps = {
  rows: Array<ReactNode>;
  focused: boolean;
  getFocus: () => void;
  onSelect: (idx: number) => void;
} & BoxOptions;

export const ScrollSelect = ({
  rows,
  focused,
  getFocus,
  onSelect,
  ...props
}: ScrollSelectProps) => {
  const scrollRef = useRef<ScrollBoxRenderable | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState(0);

  useEffect(() => {
    const scrollbox = scrollRef.current;

    if (!scrollbox) {
      return;
    }

    const rows_ = scrollbox.getChildren();
    const row = rows_[hoveredIdx];

    if (!row) {
      return;
    }

    const viewportHeight = scrollbox.viewport.height;

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
  }, [hoveredIdx]);

  useKeyboard(key => {
    if (!focused) {
      return;
    }

    if (key.name === 'down' || key.name === 'j') {
      setHoveredIdx(i => (i + 1) % rows.length);
    }

    if (key.name === 'up' || key.name === 'k') {
      setHoveredIdx(i => (i - 1 + rows.length) % rows.length);
    }
    if (key.name === 'return') {
      onSelect(hoveredIdx);
    }
  });

  return (
    <box
      borderColor={focused ? THEME.defs.darkBlue : THEME.defs.darkSurface2}
      borderStyle='rounded'
      flexDirection='column'
      height='100%'
      onMouseOver={getFocus}
      padding={1}
      {...props}
    >
      <scrollbox
        flexDirection='column'
        flexGrow={1}
        focused={focused}
        overflow='scroll'
        ref={scrollRef}
      >
        {rows.map((row, idx) => {
          const isHovered = hoveredIdx === idx;

          return (
            <box
              backgroundColor={isHovered ? THEME.defs.darkSurface0 : undefined}
              // biome-ignore lint/suspicious/noArrayIndexKey: .
              key={idx}
              onMouseDown={() => onSelect(idx)}
              onMouseOver={() => setHoveredIdx(idx)}
              width='100%'
            >
              {row}
            </box>
          );
        })}
      </scrollbox>
    </box>
  );
};
