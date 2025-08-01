'use client'

import Link from 'next/link'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'

export default function DesktopLanding() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Header />

      <main className="w-full max-w-6xl mx-auto px-6 py-12 text-center flex-grow">
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
      </main>

      <Footer />
    </div>
  )
}
