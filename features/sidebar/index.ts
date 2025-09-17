// features/sidebar/index.ts

// Components
export { AppSidebar } from './components/app-sidebar';
export { NavMain } from './components/nav-main';
export { NavSecondary } from './components/nav-secondary';
export { NavUser } from './components/nav-user';

// Providers
export {
  PersistentSidebarProvider,
  useSidebarContext,
} from './providers/sidebar-provider';

// Hooks
export { useNavState } from './hooks/use-nav-state';

// Types
export type {
  BreadcrumbItem,
  NavItem,
  ProjectItem,
  SecondaryNavItem,
  SidebarConfig,
  SidebarUser,
  SubNavItem,
} from './lib/types';

// Constants
export {
  BREADCRUMB_CONFIG,
  NAV_MAIN,
  NAV_SECONDARY,
  NO_SIDEBAR_ROUTES,
} from './lib/constants';
