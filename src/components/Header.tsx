'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const isAuthPage = pathname === '/signin' || pathname === '/signup'
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
    }

    checkSession()
  }, [pathname])

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Sign-out error:', error.message)
    } else {
      router.push('/signin')
    }
  }

  return (
    <header className="w-full py-6 bg-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-black">Neo-Invoice</h1>
        <nav className="space-x-4 flex items-center">
          {isAuthPage ? (
            pathname === '/signin' ? (
              <Link href="/signup" className="text-black hover:text-blue-600">
                Sign Up
              </Link>
            ) : (
              <Link href="/signin" className="text-black hover:text-blue-600">
                Sign In
              </Link>
            )
          ) : (
            <>
              <Link href="/" className="text-black hover:text-blue-600">Home</Link>
              <Link href="/capture" className="text-black hover:text-blue-600">Capture</Link>
              <Link href="/dashboard" className="text-black hover:text-blue-600">Dashboard</Link>

              {isLoggedIn && (
                <button
                  onClick={handleSignOut}
                  className="ml-4 text-black hover:text-red-600"
                >
                  Sign Out
                </button>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
