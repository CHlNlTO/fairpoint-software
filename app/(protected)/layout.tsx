// app/(protected)/layout.tsx

import { SidebarLayout } from '@/components/ui/sidebar-layout';
import { Toaster } from '@/components/ui/sonner';
import { createClient } from '@/lib/supabase/server';
import { extractUserFromClaims } from '@/lib/utils';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

// Route configuration for sidebar visibility
const NO_SIDEBAR_ROUTES = ['/welcome', '/business-registration'];

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get current pathname from headers
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  // Check if current route should have sidebar
  const shouldShowSidebar = !NO_SIDEBAR_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  // If no sidebar needed, return simple layout
  if (!shouldShowSidebar) {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  // Get user data for sidebar
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect('/auth/login');
  }

  const user = extractUserFromClaims(data.claims);

  // Return layout with sidebar
  return (
    <>
      <SidebarLayout user={user}>{children}</SidebarLayout>
      <Toaster />
    </>
  );
}
