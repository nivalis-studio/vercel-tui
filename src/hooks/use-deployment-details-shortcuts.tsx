import { useKeyboard } from '@opentui/react';

type Props = {
  onBack: () => void;
  onOpenBrowser: () => void;
};

export const useDeploymentDetailsShortcuts = ({
  onBack,
  onOpenBrowser,
}: Props) => {
  useKeyboard(key => {
    if (key.name === 'backspace') {
      onBack();
    } else if (key.name === 'o') {
      onOpenBrowser();
    }
  });
};
