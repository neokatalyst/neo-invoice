import type { NextConfig } from 'next'
import withPWA from 'next-pwa'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: { serverActions: true },
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

export default withPWA({
  ...nextConfig,
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
  },
})
