'use client';

import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ServiceWorkerInit() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
    null
  );
  const [showReload, setShowReload] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return;
    }

    // Check for updates to the service worker
    const checkForUpdates = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;

        // Check for waiting service worker
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setShowReload(true);
        }

        // Listen for new service worker installation
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                !navigator.serviceWorker.controller
              ) {
                setWaitingWorker(newWorker);
                setShowReload(true);
              }
            });
          }
        });

        // Listen for controlling service worker change
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload();
        });
      } catch (error) {
        console.error('Service Worker check failed:', error);
      }
    };

    // Check for updates periodically (every 60 seconds)
    const interval = setInterval(checkForUpdates, 60000);

    // Initial check
    checkForUpdates();

    // Check if the app is ready for offline use
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        console.log('App ready for offline use');
        setOfflineReady(true);
        setTimeout(() => setOfflineReady(false), 3000);
      });
    }

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleReload = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setShowReload(false);
    }
  };

  return (
    <>
      {showReload && (
        <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border">
          <p className="text-sm mb-2 font-medium">New version available</p>
          <Button
            onClick={handleReload}
            size="sm"
            className="text-xs flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reload to update
          </Button>
        </div>
      )}

      {offlineReady && (
        <div className="fixed bottom-4 left-4 z-50 bg-green-600 text-white p-4 rounded-lg shadow-lg">
          <p className="text-sm font-medium">App ready for offline use!</p>
        </div>
      )}
    </>
  );
}
