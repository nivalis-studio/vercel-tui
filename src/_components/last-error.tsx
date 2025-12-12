import { TextAttributes } from '@opentui/core';
import { useKeyboard } from '@opentui/react';
import { QUITTING_KEYS } from '@/constants';
import { useCtx } from '@/ctx';
import type { Modal } from '@/types/modal';

const LastErrorPanel = () => {
  const { lastError, clearLastError, getColor, setModal } = useCtx();

  useKeyboard(key => {
    if (QUITTING_KEYS.includes(key.name)) {
      setModal(null);
      return;
    }

    if (key.name === 'x') {
      clearLastError();
      setModal(null);
    }
  });

  if (!lastError) {
    return (
      <box flexDirection='column' gap={1} padding={1} width='100%'>
        <text fg={getColor('text')}>No errors recorded.</text>
        <text attributes={TextAttributes.DIM} fg={getColor('textMuted')}>
          Press Q/ESC/BACKSPACE to close
        </text>
      </box>
    );
  }

  const stack = lastError.stack ? String(lastError.stack) : '';
  const cause = lastError.cause ? String(lastError.cause) : '';

  return (
    <box flexDirection='column' gap={1} padding={1} width='100%'>
      <text attributes={TextAttributes.BOLD} fg={getColor('error')}>
        {lastError.message}
      </text>
      {cause ? <text fg={getColor('textMuted')}>{cause}</text> : null}
      {stack ? (
        <text fg={getColor('textMuted')} wrapMode='word'>
          {stack}
        </text>
      ) : null}
      <box flexDirection='row' justifyContent='space-between' marginTop={1}>
        <text attributes={TextAttributes.DIM} fg={getColor('textMuted')}>
          Q/ESC/BACKSPACE close
        </text>
        <text attributes={TextAttributes.DIM} fg={getColor('textMuted')}>
          X clear
        </text>
      </box>
    </box>
  );
};

export const LastErrorModal: Modal = {
  children: LastErrorPanel,
  key: 'last-error',
} as const;
