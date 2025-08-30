import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppSidebar } from '@/components/ui/app-sidebar';
import { extractUserFromClaims } from '@/lib/utils';
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

export default async function Page() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect('/auth/login');
  }

  // Extract user data using the shared utility
  const user = extractUserFromClaims(data.claims);

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset className="bg-card">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="mb-6">
            <h1 className="text-lg font-bold">
              Welcome back, {user.firstName || user.email.split('@')[0]}
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage your tax and accounting needs
            </p>
          </div>

          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-card border rounded-xl p-6">
              <h3 className="font-semibold mb-2">Tax Returns</h3>
              <p className="text-muted-foreground text-sm">
                View and manage your tax returns
              </p>
            </div>
            <div className="bg-card border rounded-xl p-6">
              <h3 className="font-semibold mb-2">Documents</h3>
              <p className="text-muted-foreground text-sm">
                Upload and organize your documents
              </p>
            </div>
            <div className="bg-card border rounded-xl p-6">
              <h3 className="font-semibold mb-2">Appointments</h3>
              <p className="text-muted-foreground text-sm">
                Schedule consultations with our team
              </p>
            </div>
          </div>

          <div className="bg-card border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
                <span>Tax return submitted for 2025</span>
                <span className="text-muted-foreground ml-auto">
                  2 days ago
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
                <span>Document uploaded: 1701Q Form</span>
                <span className="text-muted-foreground ml-auto">
                  1 week ago
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
                <span>Appointment scheduled for tax review</span>
                <span className="text-muted-foreground ml-auto">
                  2 weeks ago
                </span>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
