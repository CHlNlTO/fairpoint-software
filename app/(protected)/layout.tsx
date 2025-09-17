// app/(protected)/layout.tsx

import { PersistentSidebarProvider } from '@/features/sidebar';
import { createClient } from '@/lib/supabase/server';
import { extractUserFromClaims } from '@/lib/utils';
import { redirect } from 'next/navigation';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get user data for sidebar
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect('/auth/login');
  }

  const user = extractUserFromClaims(data.claims);

  // Return layout with persistent sidebar
  return (
    <PersistentSidebarProvider initialUser={user}>
      {children}
    </PersistentSidebarProvider>
  );
}
