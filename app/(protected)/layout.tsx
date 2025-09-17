// app/(protected)/layout.tsx

import { SidebarLayout } from '@/components/ui/sidebar-layout';
import { Toaster } from '@/components/ui/sonner';
import { createClient } from '@/lib/supabase/server';
import { extractUserFromClaims } from '@/lib/utils';
import { redirect } from 'next/navigation';

// Route configuration for sidebar visibility
const NO_SIDEBAR_ROUTES = ['/welcome', '/business-registration'];

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get user data for sidebar - always get it since we'll decide client-side
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect('/auth/login');
  }

  const user = extractUserFromClaims(data.claims);

  // Return layout with conditional sidebar (decision made client-side)
  return (
    <>
      <SidebarLayout user={user} noSidebarRoutes={NO_SIDEBAR_ROUTES}>
        {children}
      </SidebarLayout>
      <Toaster />
    </>
  );
}
