// features/sidebar/lib/constants.ts

import { Building2, LifeBuoy, Send, SquareTerminal } from 'lucide-react';
import type { BreadcrumbItem, NavItem, SecondaryNavItem } from './types';

// Main navigation items
export const NAV_MAIN: NavItem[] = [
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
    title: 'Businesses',
    url: '/businesses',
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
];

// Secondary navigation items
export const NAV_SECONDARY: SecondaryNavItem[] = [
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
];

// Routes that should not show sidebar
export const NO_SIDEBAR_ROUTES = ['/welcome'] as const;

// Breadcrumb configuration per route
export const BREADCRUMB_CONFIG: Record<string, BreadcrumbItem[]> = {
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
