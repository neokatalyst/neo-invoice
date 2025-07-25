'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaBars } from 'react-icons/fa'
import { supabase } from '@/lib/supabaseClient'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const isAuthPage = pathname === '/signin' || pathname === '/signup'

  const handleLogout = async () => {
    setMenuOpen(false)
    await supabase.auth.signOut()
    router.push('/signin')
  }

  return (
    <header className="w-full py-6 bg-white shadow-md relative">
      <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-black">Neo-Invoice</h1>

        {!isAuthPage ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-black hover:text-blue-600 focus:outline-none"
              aria-label="Toggle settings menu"
            >
              <FaBars className="text-2xl" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                <Link
                  href="/landing"
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>
                <nav className="space-x-4">
                <Link href="/client-dashboard/quotes" className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                >
                Quotes</Link>
                <Link href="/client-dashboard/invoices"  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                >
                Invoices</Link>
              </nav>
                <Link
                  href="/client-dashboard"
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Client Dashboard
                </Link>
                                <Link
                  href="/admin-dashboard"
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  View Profile
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <nav className="space-x-4">
            {pathname === '/signin' ? (
              <Link href="/signup" className="text-black hover:text-blue-600">
                Sign Up
              </Link>
            ) : (
              <Link href="/signin" className="text-black hover:text-blue-600">
                Sign In
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
