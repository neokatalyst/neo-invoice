'use client'

import { ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'
import Header from '@/components/Header'

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

useEffect(() => {
  console.log('✅ ClientDashboard Layout loaded')
  if (typeof window !== 'undefined') {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error('Please log in')
        router.push('/signin')
        return
      }

      const role = session.user.user_metadata.role
      if (role !== 'admin' && role !== 'member') {
        toast.error('Access Denied')
        router.push('/')
      }
    })
  }
}, [router])


  const navItems = [
    { label: 'Home', href: '/landing' },
    { label: 'Dashboard', href: '/client-dashboard' },
    { label: 'Profile', href: '/client-dashboard/profile' },
    { label: 'Invoices', href: '/client-dashboard/invoices' },
    { label: 'Quotes', href: '/client-dashboard/quotes' },
    { label: 'Subscription', href: '/client-dashboard/subscription' },
    { label: 'Settings', href: '/client-dashboard/settings' },
    { label: 'Broadcast', href: '/admin-dashboard/broadcast' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Header />
      <div className="md:flex">
        <aside className="hidden md:flex md:w-64 bg-white shadow-md flex-col justify-between">
          <div>
            <div className="p-4 font-bold text-xl border-b">Neo Invoice</div>
            <nav className="flex flex-col p-4 space-y-2">
              {navItems.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className={`p-2 rounded hover:bg-gray-200 ${
                    pathname === href ? 'bg-blue-100 text-blue-700 font-semibold' : ''
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4">
            <button
              onClick={async () => {
                await supabase.auth.signOut()
                toast.success('Signed out')
                router.push('/signin')
              }}
              className="w-full bg-red-500 text-white rounded p-2 hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Client Dashboard</h1>
          {children}
        </main>
      </div>
    </div>
  )
}
