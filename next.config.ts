import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    dirs: ['app', 'components', 'features', 'hooks', 'lib'],
    ignoreDuringBuilds: false,
  },
  allowedDevOrigins: ['*'],
};

export default nextConfig;
