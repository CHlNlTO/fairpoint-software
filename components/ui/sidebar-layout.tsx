// components/ui/sidebar-layout.tsx

'use client';

import { AppSidebar } from '@/components/ui/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useSidebarState } from '@/hooks/use-sidebar-state';
import type { User } from '@/lib/types';
import { usePathname } from 'next/navigation';
import * as React from 'react';

// Breadcrumb configuration per route
const BREADCRUMB_CONFIG: Record<
  string,
  Array<{ label: string; href?: string }>
> = {
  '/dashboard': [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Overview' },
  ],
  '/businesses': [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Businesses' },
  ],
  '/business-registration': [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Businesses', href: '/businesses' },
    { label: 'Register Business' },
  ],
};

function DynamicBreadcrumb({ pathname }: { pathname: string }) {
  const breadcrumbs = BREADCRUMB_CONFIG[pathname] || [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Page' },
  ];

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
}

interface SidebarLayoutProps {
  user: User;
  children: React.ReactNode;
  noSidebarRoutes: string[];
}

export function SidebarLayout({
  user,
  children,
  noSidebarRoutes,
}: SidebarLayoutProps) {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useSidebarState();

  // Check if current route should have sidebar (client-side)
  const shouldShowSidebar = !noSidebarRoutes.some(route =>
    pathname.startsWith(route)
  );

  // If no sidebar needed, return simple layout
  if (!shouldShowSidebar) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider defaultOpen={sidebarOpen} onOpenChange={setSidebarOpen}>
      <AppSidebar user={user} />
      <SidebarInset className="bg-card">
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
  );
}
