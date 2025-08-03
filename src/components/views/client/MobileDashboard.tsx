'use client'

import Link from 'next/link'

export default function MobileDashboard() {
  return (
    <div className="min-h-screen px-4 py-6 text-center bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Client Dashboard</h1>
      <p className="text-gray-600 mb-6">Quick access to your tools and account</p>

      <div className="space-y-4">
        <Link href="/client-dashboard/quotes" className="block w-full py-3 bg-blue-600 text-white rounded">View Quotes</Link>
        <Link href="/client-dashboard/invoices" className="block w-full py-3 bg-blue-600 text-white rounded">View Invoices</Link>
        <Link href="/client-dashboard/profile" className="block w-full py-3 bg-gray-100 text-black rounded border">Profile</Link>
        <Link href="/client-dashboard/subscription" className="block w-full py-3 bg-gray-100 text-black rounded border">Subscription</Link>
        <Link href="/client-dashboard/settings" className="block w-full py-3 bg-gray-100 text-black rounded border">Settings</Link>
        <Link href="/landing" className="block w-full py-3 bg-gray-100 text-black rounded border">Home</Link>
      </div>
    </div>
  )
}
