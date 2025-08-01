'use client'

import Link from 'next/link'
import { useUserInfo } from '@/lib/hooks/useUserInfo'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'

export default function MobileLanding() {
  const { userName, handleSignOut } = useUserInfo()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Neo-Invoice</h1>
        <p className="text-base text-gray-600 mb-6">Create and manage invoices with ease</p>

      {userName && (
        <div className="text-sm text-gray-500 mb-4">
          Hi, {userName}
          <button onClick={handleSignOut} className="ml-2 text-red-600 hover:underline">
            Sign Out
          </button>
        </div>
      )}

        <div className="w-full flex flex-col gap-4">
        <Link href="/quote/capture" className="w-full py-3 bg-blue-600 text-white rounded text-center">Create Quote</Link>
        <Link href="/capture" className="w-full py-3 bg-blue-600 text-white rounded text-center">Create Invoice</Link>
        <Link href="/products" className="w-full py-3 bg-blue-600 text-white rounded text-center">Product Management</Link>
        <Link href="/dashboard" className="w-full py-3 bg-gray-800 text-white rounded text-center">View Dashboard</Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
