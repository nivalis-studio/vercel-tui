import { ProjectSwitcherModal } from '@/_components/project-switcher';
import { ThemeSwitcherModal } from '@/_components/theme-switcher';
import type { ParsedKey } from '@opentui/core';
import type { Ctx } from '@/types/ctx';

export type Command = {
  label: string;
  action: (ctx: Ctx) => void;
  keys?: Array<Partial<ParsedKey>>;
};

export const COMMANDS: Array<Command> = [
  {
    keys: [{ name: 'g', ctrl: true }],
    label: 'Project Switcher',
    action: ctx => {
      ctx.setModal(ProjectSwitcherModal);
    },
  },
  {
    label: 'Theme Switcher',
    action: ctx => {
      ctx.setModal(ThemeSwitcherModal);
    },
  },
];
