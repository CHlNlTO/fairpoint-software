// features/sidebar/providers/sidebar-provider.tsx

'use client';

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/animate-ui/components/radix/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import type { User } from '@/lib/types';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import {
  createContext,
  memo,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AppSidebar } from '../components/app-sidebar';
import { BREADCRUMB_CONFIG, NO_SIDEBAR_ROUTES } from '../lib/constants';

const DynamicBreadcrumb = memo(function DynamicBreadcrumb({
  pathname,
}: {
  pathname: string;
}) {
  const breadcrumbs = useMemo(
    () =>
      BREADCRUMB_CONFIG[pathname] || [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Page' },
      ],
    [pathname]
  );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <React.Fragment key={index}>
              {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
              <BreadcrumbItem className="hidden md:block">
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={crumb.href || '#'}>
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
});

// Context for sidebar state
interface SidebarContextType {
  user: User | null;
  setUser: (user: User) => void;
  shouldShowSidebar: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error(
      'useSidebarContext must be used within PersistentSidebarProvider'
    );
  }
  return context;
};

interface PersistentSidebarProviderProps {
  children: React.ReactNode;
  initialUser?: User;
}

const PersistentSidebarProvider = memo(function PersistentSidebarProvider({
  children,
  initialUser,
}: PersistentSidebarProviderProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(initialUser || null);
  const [isClient, setIsClient] = useState(false);

  // Only render on client to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if current route should have sidebar (client-side)
  const shouldShowSidebar = useMemo(
    () => !NO_SIDEBAR_ROUTES.some(route => pathname.startsWith(route)),
    [pathname]
  );

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      shouldShowSidebar,
    }),
    [user, shouldShowSidebar]
  );

  // If no sidebar needed, return simple layout
  if (!shouldShowSidebar) {
    return (
      <SidebarContext.Provider value={contextValue}>
        {children}
      </SidebarContext.Provider>
    );
  }

  // Show loading state during hydration
  if (!isClient || !user) {
    return (
      <SidebarContext.Provider value={contextValue}>
        <div className="flex h-screen">
          <div className="w-64 bg-sidebar border-r">
            {/* Placeholder sidebar */}
          </div>
          <div className="flex-1 bg-card">
            <header className="flex h-16 items-center gap-2 px-4 border-b">
              {/* Placeholder header */}
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {children}
            </div>
          </div>
        </div>
      </SidebarContext.Provider>
    );
  }

  return (
    <SidebarContext.Provider value={contextValue}>
      <SidebarProvider defaultOpen={true} suppressHydrationWarning>
        <AppSidebar
          user={user}
          key={`sidebar-${user.id || user.email}`}
          suppressHydrationWarning
        />
        <SidebarInset className="bg-background" suppressHydrationWarning>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <DynamicBreadcrumb pathname={pathname} />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </SidebarContext.Provider>
  );
});

export { PersistentSidebarProvider, useSidebarContext };
