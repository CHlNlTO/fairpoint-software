// features/sidebar/hooks/use-nav-state.ts

'use client';

import { useLocalStorage } from '@/hooks/use-local-storage';
import { useCallback } from 'react';

interface NavState {
  [itemTitle: string]: boolean; // true = expanded, false = collapsed
}

export function useNavState() {
  const [navState, setNavState] = useLocalStorage<NavState>('nav-state', {});

  const isItemExpanded = useCallback(
    (itemTitle: string, defaultOpen = false): boolean => {
      return navState[itemTitle] ?? defaultOpen;
    },
    [navState]
  );

  const setItemExpanded = useCallback(
    (itemTitle: string, expanded: boolean) => {
      setNavState(prev => ({
        ...prev,
        [itemTitle]: expanded,
      }));
    },
    [setNavState]
  );

  const toggleItem = useCallback(
    (itemTitle: string, defaultOpen = false) => {
      const currentState = isItemExpanded(itemTitle, defaultOpen);
      setItemExpanded(itemTitle, !currentState);
    },
    [isItemExpanded, setItemExpanded]
  );

  return {
    isItemExpanded,
    setItemExpanded,
    toggleItem,
  };
}
