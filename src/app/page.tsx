'use client'

import Header from '@/components/Header'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-black">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl font-semibold mb-4">Welcome to Neo-Invoice</h2>
        <p className="text-lg text-gray-700 mb-6">Create and manage invoices with ease</p>
        <div className="space-x-4">
          <Link
            href="/capture"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Invoice
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            View Dashboard
          </Link>

          {/* Link to the View Profile Page */}
          <Link href="/profile">
            <button type="button" className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-900">
              View Profile
            </button>
          </Link>
        </div>
      </main>

      <footer className="w-full py-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Neo-Invoice. All rights reserved.
      </footer>
    </div>
  )
}
