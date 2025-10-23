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
      {
        title: 'Business Types',
        url: '/chart-of-accounts/business-types',
      },
      {
        title: 'Industry Types',
        url: '/chart-of-accounts/industry-types',
      },
      {
        title: 'Tax Types',
        url: '/chart-of-accounts/tax-types',
      },
      {
        title: 'Templates',
        url: '/chart-of-accounts/coa-templates',
      },
      {
        title: 'Template Items',
        url: '/chart-of-accounts/coa-template-items',
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
  '/chart-of-accounts/business-types': [
    { label: 'Chart of Accounts', href: '/chart-of-accounts' },
    { label: 'Business Types', href: '/chart-of-accounts/business-types' },
  ],
  '/chart-of-accounts/industry-types': [
    { label: 'Chart of Accounts', href: '/chart-of-accounts' },
    { label: 'Industry Types', href: '/chart-of-accounts/industry-types' },
  ],
  '/chart-of-accounts/tax-types': [
    { label: 'Chart of Accounts', href: '/chart-of-accounts' },
    { label: 'Tax Types', href: '/chart-of-accounts/tax-types' },
  ],
  '/chart-of-accounts/coa-templates': [
    { label: 'Chart of Accounts', href: '/chart-of-accounts' },
    { label: 'Templates', href: '/chart-of-accounts/coa-templates' },
  ],
  '/chart-of-accounts/coa-templates/create': [
    { label: 'Chart of Accounts', href: '/chart-of-accounts' },
    { label: 'Templates', href: '/chart-of-accounts/coa-templates' },
    {
      label: 'Create Template',
      href: '/chart-of-accounts/coa-templates/create',
    },
  ],
  '/chart-of-accounts/coa-template-items': [
    { label: 'Chart of Accounts', href: '/chart-of-accounts' },
    { label: 'Template Items', href: '/chart-of-accounts/coa-template-items' },
  ],
};

// Dynamic breadcrumb configurations for routes with parameters
export const DYNAMIC_BREADCRUMB_CONFIG = [
  {
    pattern: '/chart-of-accounts/coa-templates/edit/:id',
    breadcrumbs: [
      { label: 'Chart of Accounts', href: '/chart-of-accounts' },
      { label: 'Templates', href: '/chart-of-accounts/coa-templates' },
      {
        label: 'Edit Template',
        href: '/chart-of-accounts/coa-templates/edit/:id',
      },
    ],
  },
];
