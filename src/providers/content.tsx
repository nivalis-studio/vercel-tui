import { createContext, type ReactNode, useContext, useState } from 'react';

type ContentContextType = {
  content: ReactNode;
  setContent: (content: ReactNode) => void;
};

const contentCtx = createContext<ContentContextType | null>(null);

type ContentProviderProps = {
  children?: ReactNode;
  initialContent?: ReactNode;
};

export const ContentProvider = ({
  children,
  initialContent = null,
}: ContentProviderProps) => {
  const [content, setContent] = useState<ReactNode>(initialContent);

  return (
    <contentCtx.Provider value={{ content, setContent }}>
      {/* Render the current content */}
      {content}
      {/* Also render children (for modals, overlays, etc.) */}
      {children}
    </contentCtx.Provider>
  );
};

export const useContent = () => {
  const context = useContext(contentCtx);
  if (!context) {
    throw new Error('useContent must be used within ContentProvider');
  }
  return context;
};
