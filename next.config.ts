import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    dirs: ['app', 'components', 'features', 'hooks', 'lib'],
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
