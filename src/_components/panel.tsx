import { useKeyboard } from '@opentui/react';
import { ScrollSelect } from './scroll-select';
import type { Ctx } from '@/types/ctx';

type Props = {
  ctx: Ctx;
};

export const Panel = ({ ctx }: Props) => {
  const { setModal, getColor } = ctx;

  useKeyboard(key => {
    if (key.name === 'q') {
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
          backgroundColor: getColor('backgroundElement'),
        }}
      >
        <ScrollSelect
          focused
          getFocus={() => null}
          onSelect={() => null}
          rows={[]}
          title='Command panel'
        />
      </scrollbox>
    </box>
  );
};
