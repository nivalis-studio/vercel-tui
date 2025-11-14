import { useKeyboard } from '@opentui/react';
import { QUITTING_KEYS } from '@/constants';
import { useCtx } from '@/ctx';
import { THEMES } from '@/lib/colors';
import { CONFIG } from '@/lib/config';
import { ScrollSelect } from './scroll-select';

export const ThemeSwitcher = () => {
  const { setTheme, setModal, getColor } = useCtx();

  const current = CONFIG.get().theme;

  const themes = THEMES;

  const onHover = (idx: number) => {
    const selected = themes[idx];

    if (!selected) {
      return;
    }

    setTheme(selected);
  };

  const onSelect = async (idx: number) => {
    const selected = themes[idx];

    if (!selected) {
      return;
    }

    await setTheme(selected, true);
    setModal(null);
  };

  useKeyboard(key => {
    if (QUITTING_KEYS.includes(key.name)) {
      setTheme(CONFIG.get().theme);
      setModal(null);
    }
  });

  return (
    <ScrollSelect
      onHover={onHover}
      onSelect={onSelect}
      rows={themes.map(name => (
        <box flexDirection='row' gap={1} key={name}>
          {current === name && <text fg={getColor('primary')}>*</text>}

          <text>{name}</text>
        </box>
      ))}
      title='Switch project'
    />
  );
};
