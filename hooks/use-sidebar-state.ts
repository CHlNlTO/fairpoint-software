// hooks/use-sidebar-state.ts

'use client';

import { useLocalStorage } from '@/hooks/use-local-storage';

export function useSidebarState() {
  const [sidebarOpen, setSidebarOpen] = useLocalStorage('sidebar-open', true);

  return {
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar: () => setSidebarOpen(!sidebarOpen),
  };
}
