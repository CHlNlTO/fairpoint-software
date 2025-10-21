// features/sidebar/lib/constants.ts

import {
  Building2,
  LifeBuoy,
  ScrollText,
  Send,
  SquareTerminal,
} from 'lucide-react';
import type { BreadcrumbItem, NavItem, SecondaryNavItem } from './types';

// Main navigation items
export const NAV_MAIN: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: SquareTerminal,
    isActive: true,
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
  {
    title: 'Chart of Accounts',
    url: '/chart-of-accounts',
    icon: ScrollText,
    items: [
      {
        title: 'Classes',
        url: '/chart-of-accounts/classes',
      },
      {
        title: 'Subclasses',
        url: '/chart-of-accounts/subclasses',
      },
      {
        title: 'Types',
        url: '/chart-of-accounts/types',
      },
      {
        title: 'Subtypes',
        url: '/chart-of-accounts/subtypes',
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
export const NO_SIDEBAR_ROUTES = [
  '/welcome',
  '/business-registration',
] as const;

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
  '/chart-of-accounts/classes': [
    { label: 'Chart of Accounts', href: '/chart-of-accounts' },
    { label: 'Classes', href: '/chart-of-accounts/classes' },
  ],
  '/chart-of-accounts/subclasses': [
    { label: 'Chart of Accounts', href: '/chart-of-accounts' },
    { label: 'Subclasses', href: '/chart-of-accounts/subclasses' },
  ],
  '/chart-of-accounts/types': [
    { label: 'Chart of Accounts', href: '/chart-of-accounts' },
    { label: 'Types', href: '/chart-of-accounts/types' },
  ],
  '/chart-of-accounts/subtypes': [
    { label: 'Chart of Accounts', href: '/chart-of-accounts' },
    { label: 'Subtypes', href: '/chart-of-accounts/subtypes' },
  ],
};
