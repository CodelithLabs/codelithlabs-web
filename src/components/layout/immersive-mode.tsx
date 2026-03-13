'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface ImmersiveModeValue {
  immersive: boolean;
  setImmersive: (immersive: boolean) => void;
}

const ImmersiveModeContext = createContext<ImmersiveModeValue | null>(null);

export function ImmersiveModeProvider({ children }: { children: ReactNode }) {
  const [immersive, setImmersiveState] = useState(false);

  const setImmersive = useCallback((next: boolean) => {
    setImmersiveState(next);
  }, []);

  const value = useMemo(
    () => ({ immersive, setImmersive }),
    [immersive, setImmersive],
  );

  return (
    <ImmersiveModeContext.Provider value={value}>
      {children}
    </ImmersiveModeContext.Provider>
  );
}

export function useImmersiveMode() {
  const context = useContext(ImmersiveModeContext);
  if (!context) {
    throw new Error('useImmersiveMode must be used within ImmersiveModeProvider');
  }
  return context;
}