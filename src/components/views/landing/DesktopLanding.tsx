'use client'

import PageWrapper from '@/components/layouts/PageWrapper'
import Link from 'next/link'

export default function DesktopLanding() {
  return (
    <PageWrapper maxWidth="2xl">
      <div className="text-center py-12">
        <h2 className="text-5xl font-bold mb-4">Welcome to Neo-Invoice</h2>
        <p className="text-lg text-gray-600 mb-10">Create and manage invoices with ease</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/quote/capture" className="py-4 bg-blue-600 text-white rounded text-center hover:bg-blue-700">
            Create Quote
          </Link>
          <Link href="/capture" className="py-4 bg-blue-600 text-white rounded text-center hover:bg-blue-700">
            Create Invoice
          </Link>
          <Link href="/products" className="py-4 bg-blue-600 text-white rounded text-center hover:bg-blue-700">
            Products
          </Link>
          <Link href="/dashboard" className="py-4 bg-gray-800 text-white rounded text-center hover:bg-gray-900">
            Dashboard
          </Link>
        </div>
      </div>
    </PageWrapper>
  )
}
