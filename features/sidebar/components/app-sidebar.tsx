// features/sidebar/components/app-sidebar.tsx

'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/animate-ui/components/radix/sidebar';
import type { User } from '@/lib/types';
import { Command } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { memo } from 'react';
import { NAV_MAIN, NAV_SECONDARY } from '../lib/constants';
import { NavMain } from './nav-main';
import { NavSecondary } from './nav-secondary';
import { NavUser } from './nav-user';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User;
}

const AppSidebar = memo(function AppSidebar({
  user,
  ...props
}: AppSidebarProps) {
  // Prepare user data for nav components
  const userData = React.useMemo(
    () => ({
      name: user.firstName || user.email.split('@')[0],
      email: user.email,
      avatar: user.avatar || '/avatars/accountant.jpg',
    }),
    [user.firstName, user.email, user.avatar]
  );

  return (
    <Sidebar variant="inset" side="left" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard">
                <Command />
                <span>Fairpoint</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="sidebar-scrollbar">
        <NavMain items={NAV_MAIN} />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={NAV_SECONDARY} className="mt-auto" />
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
});

export { AppSidebar };
