// features/sidebar/lib/types.ts

import type { LucideIcon } from 'lucide-react';

export interface SubNavItem {
  title: string;
  url: string;
}

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: SubNavItem[];
}

export interface SecondaryNavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface ProjectItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface SidebarConfig {
  noSidebarRoutes: readonly string[];
  breadcrumbConfig: Record<string, BreadcrumbItem[]>;
}

export interface SidebarUser {
  name: string;
  email: string;
  avatar: string;
}
