// app/(protected)/business-registration/page.tsx

'use client';

import { BusinessRegistrationWizard } from '@/features/business-registration';
import type { BusinessRegistrationData } from '@/features/business-registration/lib/types';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function BusinessRegistrationPage() {
  const router = useRouter();

  const handleComplete = (data: BusinessRegistrationData) => {
    toast.success('Business registration completed successfully!');
    // Redirect to dashboard after successful registration
    router.push('/dashboard');
  };

  const handleCancel = () => {
    // Redirect back to dashboard or previous page
    router.back();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <BusinessRegistrationWizard
        onComplete={handleComplete}
        onCancel={handleCancel}
        className="max-w-4xl"
      />
    </div>
  );
}
