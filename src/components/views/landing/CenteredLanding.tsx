'use client'

import Link from 'next/link'
import { useUserInfo } from '@/lib/hooks/useUserInfo'

export default function CenteredLanding() {
  const { userName, handleSignOut } = useUserInfo()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold mb-4">Neo-Invoice</h1>
        <p className="text-lg text-gray-600 mb-4">Create and manage invoices with ease</p>

        {userName && (
          <div className="text-sm text-gray-500 mb-6">
            Hi, {userName}
            <button onClick={handleSignOut} className="ml-2 text-red-600 hover:underline">
              Sign Out
            </button>
          </div>
        )}

        <div className="space-y-4">
          <Link href="/quote/capture" className="block w-full py-3 bg-blue-600 text-white rounded">Create Quote</Link>
          <Link href="/capture" className="block w-full py-3 bg-blue-600 text-white rounded">Create Invoice</Link>
          <Link href="/products" className="block w-full py-3 bg-blue-600 text-white rounded">Product Management</Link>
          <Link href="/dashboard" className="block w-full py-3 bg-gray-800 text-white rounded">View Dashboard</Link>
        </div>
      </div>
    </div>
  )
}
