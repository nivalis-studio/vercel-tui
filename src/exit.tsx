import { exit } from 'node:process';
import { useKeyboard } from '@opentui/react';
import type { ReactNode } from 'react';

export const ExitProvider = ({ children }: { children: ReactNode }) => {
  useKeyboard(key => {
    if (key.name === 'q' && key.shift) {
      exit(0);
    }
  });

  return children;
};
