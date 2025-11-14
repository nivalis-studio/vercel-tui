import { useKeyboard } from '@opentui/react';
import { useCtx } from '@/ctx';
import { COMMANDS } from '@/lib/commands';

export const useCommands = () => {
  const ctx = useCtx();

  useKeyboard(key => {
    for (const command of COMMANDS) {
      if (!command.keys) {
        continue;
      }

      const matches = command.keys.some(commandKey => {
        return Object.entries(commandKey).every(([prop, value]) => {
          return key[prop as keyof typeof key] === value;
        });
      });

      if (matches) {
        command.action(ctx);
        break;
      }
    }
  });
};
