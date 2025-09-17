// app/(protected)/dashboard/page.tsx

import { DashboardOverview } from '@/features/dashboard';
import { createClient } from '@/lib/supabase/server';
import { extractUserFromClaims } from '@/lib/utils';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect('/auth/login');
  }

  // Extract user data using the shared utility
  const user = extractUserFromClaims(data.claims);

  return <DashboardOverview user={user} />;
}
