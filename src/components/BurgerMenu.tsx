'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaBars } from 'react-icons/fa'
import { supabase } from '@/lib/supabaseClient'

export default function BurgerMenu() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/signin')
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-black hover:text-blue-600 focus:outline-none"
        aria-label="Open Menu"
      >
        <FaBars className="text-2xl" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
          <Link
            href="/"
            className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/quote/capture"
            className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Create Quote
          </Link>
          <Link
            href="/capture"
            className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Create Invoice
          </Link>
          <Link
            href="/products"
            className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Products
          </Link>
          <Link
            href="/client-dashboard"
            className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>
          <button
            onClick={() => {
              setOpen(false)
              handleLogout()
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
