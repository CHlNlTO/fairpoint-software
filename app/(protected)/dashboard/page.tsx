// app/(protected)/dashboard/page.tsx

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

  return (
    <>
      <div className="mb-6">
        <h1 className="text-lg font-bold">
          Welcome back, {user.firstName || user.email.split('@')[0]}
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your tax and accounting needs
        </p>
      </div>

      <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        <div className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow">
          <a href="/business-registration" className="block">
            <h3 className="font-semibold mb-2 text-primary">
              Business Registration
            </h3>
            <p className="text-muted-foreground text-sm">
              Register your business and set up your account
            </p>
          </a>
        </div>
      </div>

      <div className="bg-card border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
            <span>Tax return submitted for 2025</span>
            <span className="text-muted-foreground ml-auto">2 days ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
            <span>Document uploaded: 1701Q Form</span>
            <span className="text-muted-foreground ml-auto">1 week ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
            <span>Appointment scheduled for tax review</span>
            <span className="text-muted-foreground ml-auto">2 weeks ago</span>
          </div>
        </div>
      </div>
    </>
  );
}
