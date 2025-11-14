import { useKeyboard } from '@opentui/react';
import { ScrollSelect } from '@/_components/scroll-select';
import { QUITTING_KEYS } from '@/constants';
import { useCtx } from '@/ctx';
import { COMMANDS, type Command } from '@/lib/commands';
import type { Modal } from '@/types/modal';

type CommandPanelItemProps = {
  command: Command;
};

const CommandPanelItem = ({ command }: CommandPanelItemProps) => {
  return (
    <box>
      <text>{command.label}</text>
    </box>
  );
};

const CommandPanel = () => {
  const ctx = useCtx();

  useKeyboard(key => {
    if (QUITTING_KEYS.includes(key.name)) {
      ctx.setModal(null);
    }
  });

  return (
    <ScrollSelect
      onSelect={idx => COMMANDS[idx]?.action(ctx) ?? null}
      rows={COMMANDS.map(command => (
        <CommandPanelItem command={command} key={command.label} />
      ))}
      title='Command panel'
    />
  );
};

export const CommandPanelModal: Modal = {
  children: CommandPanel,
  key: 'command-panel',
} as const;
