import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/products/:id/variants/:variantId/edit',
          destination: '/products/:id/edit?variantId=:variantId',
        },
      ],
    };
  },
};

export default nextConfig;
