
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const [userName, setUserName] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        const { user_metadata } = session.user
        const name = user_metadata?.first_name || null
        setUserName(name)
      }
    }

    getSession()
  }, [])

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      router.push('/signin')
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <header className="w-full py-6 bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Neo-Invoice</h1>
          <nav className="space-x-4 flex items-center">
            <Link href="/" className="text-gray-600 hover:text-black">Home</Link>
            <Link href="/capture" className="text-gray-600 hover:text-black">Capture</Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-black">Dashboard</Link>

            {userName && (
              <>
                <span className="text-gray-500 text-sm ml-4">Hi, {userName}</span>
                <button
                  onClick={handleSignOut}
                  className="ml-2 text-sm text-red-600 hover:underline"
                >
                  Sign Out
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl font-semibold mb-4">Welcome to Neo-Invoice</h2>
        <p className="text-lg text-gray-600 mb-6">Create and manage invoices with ease</p>
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
        </div>
      </main>

      <footer className="w-full py-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Neo-Invoice. All rights reserved.
      </footer>
    </div>
  )
}