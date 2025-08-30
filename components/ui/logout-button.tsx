'use client';

import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function LogoutButton({
  children,
  className,
  variant,
}: {
  children?: React.ReactNode;
  className?: string;
  variant?:
    | 'default'
    | 'ghost'
    | 'outline'
    | 'secondary'
    | 'destructive'
    | 'link';
}) {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <Button onClick={logout} className={className} variant={variant}>
      {children}
    </Button>
  );
}
