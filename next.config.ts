import type { NextConfig } from 'next';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: false, // Enable in both dev and prod for testing
  register: true,
  skipWaiting: true,
  sw: 'sw.js',
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
});

const nextConfig: NextConfig = {
  eslint: {
    dirs: ['app', 'components', 'features', 'hooks', 'lib'],
    ignoreDuringBuilds: false,
  },
  allowedDevOrigins: ['*'],
};

export default withPWA(nextConfig);
