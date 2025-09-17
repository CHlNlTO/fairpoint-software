// features/sidebar/components/nav-secondary.tsx

'use client';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/animate-ui/components/radix/sidebar';
import * as React from 'react';
import { memo } from 'react';
import type { SecondaryNavItem } from '../lib/types';

interface NavSecondaryProps
  extends React.ComponentPropsWithoutRef<typeof SidebarGroup> {
  items: SecondaryNavItem[];
}

const NavSecondary = memo(function NavSecondary({
  items,
  ...props
}: NavSecondaryProps) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm">
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
});

export { NavSecondary };
