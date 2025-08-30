// app/(protected)/welcome/page.tsx

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { WelcomeLayout, WelcomePage } from '@/features/welcome';
import { extractUserFromClaims } from '@/lib/utils';
import { isNewlyCreatedUser } from '@/lib/utils';

export default async function WelcomePageRoute() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    redirect('/auth/login');
  }

  // Check if user should see welcome page
  const isNewUser = isNewlyCreatedUser(user);

  if (!isNewUser) {
    // Existing user, redirect to dashboard
    redirect('/dashboard');
  }

  // Extract user data from claims for the welcome page
  const { data: claimsData } = await supabase.auth.getClaims();
  const userProfile = extractUserFromClaims(claimsData?.claims || {});

  return (
    <WelcomeLayout>
      <WelcomePage user={userProfile} />
    </WelcomeLayout>
  );
}
