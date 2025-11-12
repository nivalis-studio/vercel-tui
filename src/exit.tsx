import { exit } from 'node:process';
import { useKeyboard, useRenderer } from '@opentui/react';
import type { ReactNode } from 'react';

export const ExitProvider = ({ children }: { children: ReactNode }) => {
  const renderer = useRenderer();
  useKeyboard(key => {
    if (key.name === 'q' && key.shift) {
      exit(0);
    }

    if (key.name === 'k' && key.ctrl) {
      renderer.console.toggle();
    }
  });

  return children;
};
