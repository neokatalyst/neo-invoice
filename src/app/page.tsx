'use client'

import Header from '@/components/Header'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-black">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl font-semibold mb-4">Welcome to Neo-Invoice</h2>
        <p className="text-lg text-gray-700 mb-6">Create and manage your quotes and invoices with ease.</p>

        <div className="space-y-4 w-full max-w-xs">

          {/* Client Features */}
          <Link href="/quote/capture" className="block w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-center">
            ➕ Create Quote
          </Link>
          <Link href="/capture" className="block w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-center">
            ➕ Create Invoice
          </Link>
          <Link href="/client-dashboard/quotes" className="block w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 text-center">
            📄 View Quotes
          </Link>
          <Link href="/client-dashboard/invoices" className="block w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 text-center">
            📑 View Invoices
          </Link>

          {/* Dashboards */}
          <Link href="/client-dashboard" className="block w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 text-center">
            📊 Client Dashboard
          </Link>
          <Link href="/admin-dashboard" className="block w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 text-center">
            🛠️ Admin Dashboard
          </Link>

          {/* Profile */}
          <Link href="/profile" className="block w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 text-center">
            👤 View Profile
          </Link>
        </div>
      </main>

      <footer className="w-full py-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Neo-Invoice. All rights reserved.
      </footer>
    </div>
  )
}
