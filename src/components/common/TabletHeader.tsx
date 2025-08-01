'use client'

import Link from 'next/link'
import BurgerMenu from '@/components/BurgerMenu'
import { useUserInfo } from '@/lib/hooks/useUserInfo'

export default function TabletHeader() {
  const { handleSignOut } = useUserInfo()
  return (
    <header className="w-full bg-white shadow py-5 px-6 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold">
        Neo-Invoice
      </Link>
      <nav className="flex items-center space-x-4 text-sm">
        <Link href="/" className="text-gray-600 hover:text-black">Home</Link>
        <Link href="/profile" className="text-gray-600 hover:text-black">Profile</Link>
        <Link href="/client-dashboard" className="text-gray-600 hover:text-black">Dashboard</Link>
        <button onClick={handleSignOut} className="text-red-600 hover:underline">Sign Out</button>
        <BurgerMenu />
      </nav>
    </header>
  )
}
