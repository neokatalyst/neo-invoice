'use client'

import './globals.css'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Toaster } from 'react-hot-toast'
import { supabase } from '@/lib/supabaseClient'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Only redirect on SIGNED_OUT
      if (event === 'SIGNED_OUT') {
        router.push('/signin')
      }

      // Avoid forced /profile redirect for every SIGNED_IN
      // You can control initial redirect better from auth logic or /signup page
    })

    return () => subscription.unsubscribe()
  }, [router])

  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  )
}
