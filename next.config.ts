import type { NextConfig } from 'next'
// PWA support via next-pwa. The service worker is disabled in development.
import withPWA from 'next-pwa'

const nextConfig: NextConfig = {
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
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  ...nextConfig,
})
