'use client';

import {
  BookOpen,
  Building2,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  User,
  type LucideIcon,
} from 'lucide-react';
import * as React from 'react';

import { NavMain } from '@/components/ui/nav-main';
import { NavProjects } from '@/components/ui/nav-projects';
import { NavSecondary } from '@/components/ui/nav-secondary';
import { NavUser } from '@/components/ui/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { User as SharedUser } from '@/lib/types';

// Define the sidebar data structure
interface SidebarData {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  navMain: Array<{
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: Array<{
      title: string;
      url: string;
    }>;
  }>;
  navSecondary: Array<{
    title: string;
    url: string;
    icon: LucideIcon;
  }>;
  projects: Array<{
    name: string;
    url: string;
    icon: LucideIcon;
  }>;
}

// Default data structure
const defaultData: Omit<SidebarData, 'user'> = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'Overview',
          url: '/dashboard',
        },
        {
          title: 'Tasks',
          url: '/dashboard/tasks',
        },
        {
          title: 'Reminders',
          url: '/dashboard/reminders',
        },
      ],
    },
    {
      title: 'Business Registration',
      url: '/business-registration',
      icon: Building2,
      items: [
        {
          title: 'Register Business',
          url: '/business-registration',
        },
        {
          title: 'My Businesses',
          url: '/businesses',
        },
      ],
    },
    {
      title: 'Clients',
      url: '/clients',
      icon: User,
      items: [
        {
          title: 'All Clients',
          url: '/clients',
        },
        {
          title: 'Add Client',
          url: '/clients/new',
        },
        {
          title: 'Client Groups',
          url: '/clients/groups',
        },
      ],
    },
    {
      title: 'Documents',
      url: '/documents',
      icon: BookOpen,
      items: [
        {
          title: 'All Documents',
          url: '/documents',
        },
        {
          title: 'Upload',
          url: '/documents/upload',
        },
        {
          title: 'Templates',
          url: '/documents/templates',
        },
        {
          title: 'Archive',
          url: '/documents/archive',
        },
      ],
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings2,
      items: [
        {
          title: 'Profile',
          url: '/settings/profile',
        },
        {
          title: 'Team',
          url: '/settings/team',
        },
        {
          title: 'Billing',
          url: '/settings/billing',
        },
        {
          title: 'Integrations',
          url: '/settings/integrations',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Support',
      url: '/support',
      icon: LifeBuoy,
    },
    {
      title: 'Feedback',
      url: '/feedback',
      icon: Send,
    },
  ],
  projects: [
    {
      name: '2025 Tax Returns',
      url: '/projects/2025-tax-returns',
      icon: Frame,
    },
    {
      name: 'Bookkeeping Q1',
      url: '/projects/bookkeeping-q1',
      icon: PieChart,
    },
    {
      name: 'Payroll',
      url: '/projects/payroll',
      icon: Map,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: SharedUser;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  // Combine user data with default data
  const data: SidebarData = {
    ...defaultData,
    user: {
      name: user.firstName || user.email.split('@')[0], // Use email prefix if no firstName
      email: user.email,
      avatar: user.avatar || '/avatars/accountant.jpg', // Default avatar
    },
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/dashboard">
                <Command />
                <span>Fairpoint</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
