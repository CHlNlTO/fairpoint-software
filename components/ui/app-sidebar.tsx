"use client"

import * as React from "react"
import {
  BookOpen,
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
} from "lucide-react"

import { NavMain } from "@/components/ui/nav-main"
import { NavProjects } from "@/components/ui/nav-projects"
import { NavSecondary } from "@/components/ui/nav-secondary"
import { NavUser } from "@/components/ui/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Define the user type
interface User {
  name?: string
  email: string
  avatar?: string
}

// Define the sidebar data structure
interface SidebarData {
  user: {
    name: string
    email: string
    avatar: string
  }
  navMain: Array<{
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: Array<{
      title: string
      url: string
    }>
  }>
  navSecondary: Array<{
    title: string
    url: string
    icon: LucideIcon
  }>
  projects: Array<{
    name: string
    url: string
    icon: LucideIcon
  }>
}

// Default data structure
const defaultData: Omit<SidebarData, 'user'> = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Tasks",
          url: "/dashboard/tasks",
        },
        {
          title: "Reminders",
          url: "/dashboard/reminders",
        },
      ],
    },
    {
      title: "Clients",
      url: "/clients",
      icon: User,
      items: [
        {
          title: "All Clients",
          url: "/clients",
        },
        {
          title: "Add Client",
          url: "/clients/new",
        },
        {
          title: "Client Groups",
          url: "/clients/groups",
        },
      ],
    },
    {
      title: "Documents",
      url: "/documents",
      icon: BookOpen,
      items: [
        {
          title: "All Documents",
          url: "/documents",
        },
        {
          title: "Upload",
          url: "/documents/upload",
        },
        {
          title: "Templates",
          url: "/documents/templates",
        },
        {
          title: "Archive",
          url: "/documents/archive",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "Profile",
          url: "/settings/profile",
        },
        {
          title: "Team",
          url: "/settings/team",
        },
        {
          title: "Billing",
          url: "/settings/billing",
        },
        {
          title: "Integrations",
          url: "/settings/integrations",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "2025 Tax Returns",
      url: "/projects/2025-tax-returns",
      icon: Frame,
    },
    {
      name: "Bookkeeping Q1",
      url: "/projects/bookkeeping-q1",
      icon: PieChart,
    },
    {
      name: "Payroll",
      url: "/projects/payroll",
      icon: Map,
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  // Combine user data with default data
  const data: SidebarData = {
    ...defaultData,
    user: {
      name: user.name || user.email.split('@')[0], // Use email prefix if no name
      email: user.email,
      avatar: user.avatar || "/avatars/accountant.jpg", // Default avatar
    }
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{data.user.name}</span>
                  <span className="truncate text-xs">Accountant</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
