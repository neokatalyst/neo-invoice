'use client'

import Link from 'next/link'
import { useUserInfo } from '@/lib/hooks/useUserInfo'

export default function Header() {
  const { userName, handleSignOut } = useUserInfo()

  return (
    <header className="w-full bg-white shadow py-6">
      <div className="w-full max-w-6xl mx-auto px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Neo-Invoice</h1>
        <nav className="space-x-6">
          <Link href="/profile" className="text-gray-600 hover:text-black">Profile</Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-black">Dashboard</Link>
          {userName && (
            <>
              <span className="text-gray-500">Hi, {userName}</span>
              <button onClick={handleSignOut} className="text-red-600 hover:underline">
                Sign Out
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
