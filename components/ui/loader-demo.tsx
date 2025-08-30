// components/ui/loader-demo.tsx

'use client';

import { Button } from '@/components/ui/button';
import { useFullPageLoader } from '@/hooks/use-full-page-loader';

export function LoaderDemo() {
  const { show, showSuccess, hide } = useFullPageLoader();

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Full Page Loader Demo</h2>
      <p className="text-muted-foreground">
        Test the different loader variants and see how they look and behave.
      </p>

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => show('Processing your request...', 'default')}
          variant="outline"
        >
          Show Default Loader
        </Button>

        <Button
          onClick={() => show('Processing...', 'processing')}
          variant="outline"
        >
          Show Processing Loader
        </Button>

        <Button
          onClick={() => showSuccess('Operation completed successfully!')}
          variant="outline"
        >
          Show Success Loader
        </Button>

        <Button onClick={hide} variant="destructive">
          Hide Loader
        </Button>
      </div>
    </div>
  );
}
