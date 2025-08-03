'use client'

import Link from 'next/link'

export default function DesktopDashboard() {
  return (
    <main className="flex-grow w-full max-w-6xl mx-auto px-6 py-12 text-center">
      <p className="text-gray-600 mb-10">Access quotes, invoices, and tools</p>

      <div className="grid grid-cols-3 gap-6">
        <Link href="/client-dashboard/quotes" className="col-span-1 py-4 bg-blue-600 text-white rounded hover:bg-blue-700">
          View Quotes
        </Link>
        <Link href="/client-dashboard/invoices" className="col-span-1 py-4 bg-blue-600 text-white rounded hover:bg-blue-700">
          View Invoices
        </Link>
        <Link href="/capture" className="col-span-1 py-4 bg-gray-800 text-white rounded hover:bg-gray-900">
          New Invoice
        </Link>
      </div>
    </main>
  )
}
