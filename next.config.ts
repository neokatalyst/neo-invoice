import type { NextConfig } from 'next'

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

export default nextConfig
