import { TextAttributes } from '@opentui/core';
import { useKeyboard } from '@opentui/react';
import { useState } from 'react';
import { saveConfig } from '@/lib/config';

type Props = {
  onComplete: () => void;
};

export const Setup = ({ onComplete }: Props) => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  useKeyboard(key => {
    if (key.name === 'return') {
      if (token.trim().length === 0) {
        setError('Token cannot be empty');
        return;
      }

      try {
        saveConfig({ bearerToken: token.trim() });
        onComplete();
      } catch {
        setError('Failed to save configuration');
      }
    } else if (key.name === 'backspace') {
      setToken(prev => prev.slice(0, -1));
      setError('');
    } else if (key.name === 'escape') {
      process.exit(0);
    } else if (key.sequence && key.sequence.length === 1) {
      setToken(prev => prev + key.sequence);
      setError('');
    }
  });

  return (
    <box flexDirection='column' flexGrow={1} padding={1}>
      <box alignItems='flex-end' justifyContent='flex-start' marginBottom={1}>
        <ascii-font font='tiny' text='Nivalis Vercel TUI' />
      </box>

      <box border flexDirection='column' flexGrow={1} title='Setup'>
        <box flexDirection='column' gap={1} padding={2}>
          <box flexDirection='column' marginBottom={2}>
            <text attributes={TextAttributes.BOLD}>Welcome to Vercel TUI!</text>
            <text attributes={TextAttributes.DIM}>
              First-time setup required
            </text>
          </box>

          <box flexDirection='column' marginBottom={2}>
            <text attributes={TextAttributes.BOLD}>
              Generate a Vercel Token
            </text>
            <text attributes={TextAttributes.DIM}>
              1. Visit: https://vercel.com/account/tokens
            </text>
            <text attributes={TextAttributes.DIM}>2. Click "Create Token"</text>
            <text attributes={TextAttributes.DIM}>
              3. Give it a name (e.g., "Vercel TUI")
            </text>
            <text attributes={TextAttributes.DIM}>
              4. Select appropriate scope
            </text>
            <text attributes={TextAttributes.DIM}>
              5. Copy the generated token
            </text>
          </box>

          <box flexDirection='column' marginBottom={1}>
            <text attributes={TextAttributes.BOLD}>
              Enter your Vercel Token:
            </text>
            <box
              border
              marginTop={1}
              paddingLeft={1}
              paddingRight={1}
              style={{ backgroundColor: '#1f2335' }}
            >
              <text>{token || ' '}</text>
            </box>
          </box>

          {error && (
            <box marginBottom={1}>
              <text fg='red'>{error}</text>
            </box>
          )}

          <box flexDirection='column' marginTop={2}>
            <text attributes={TextAttributes.DIM}>
              Press ENTER to save | ESC to quit
            </text>
            <text attributes={TextAttributes.DIM}>
              Token will be saved to: ~/.config/vercel-tui/config.json
            </text>
          </box>
        </box>
      </box>
    </box>
  );
};
