import withPWA from 'next-pwa'
import type { NextConfig } from 'next'

const baseConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['*'],
    },
  },
  async redirects() {
    return [
      {
        source: '/quote/list',
        destination: '/client-dashboard/quotes',
        permanent: true,
      },
      {
        source: '/invoice/list',
        destination: '/client-dashboard/invoices',
        permanent: true,
      },
      {
        source: '/dashboard',
        destination: '/client-dashboard',
        permanent: true,
      },
    ]
  },
}

// Correctly wrap base config and isolate PWA config under `pwa` key
const nextConfig = withPWA({
  ...baseConfig,
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
  },
})

export default nextConfig
