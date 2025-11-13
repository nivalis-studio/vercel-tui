import { useKeyboard } from '@opentui/react';
import { quittingKeys } from '@/constants';
import { ScrollSelect } from './scroll-select';
import type { Ctx } from '@/types/ctx';

type Props = {
  ctx: Ctx;
};

export const Panel = ({ ctx }: Props) => {
  const { setModal, getColor, modal } = ctx;
  const isFocused = modal !== null;

  useKeyboard(key => {
    if (!isFocused) {
      return;
    }

    if (quittingKeys.includes(key.name)) {
      setModal(null);
    }
  });

  return (
    <box
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <scrollbox
        style={{
          width: '50%',
          maxWidth: 100,
          height: '40%',
          maxHeight: 35,
          backgroundColor: getColor('backgroundPanel'),
        }}
      >
        <ScrollSelect
          focused
          getFocus={() => null}
          onSelect={() => null}
          rows={[
            <text key={1}>Item 1</text>,
            <text key={2}>Item 2</text>,
            <text key={3}>Item 3</text>,
          ]}
          title='Command panel'
        />
      </scrollbox>
    </box>
  );
};
