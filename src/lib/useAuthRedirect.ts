// lib/useAuthRedirect.ts
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from './supabaseClient'

export function useAuthRedirect() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const publicRoutes = ['/', '/signin', '/signup']

      if (user && pathname === '/') {
        // Optional: route authenticated users away from landing page
        router.push('/dashboard') // or '/capture'
      } else if (!user && !publicRoutes.includes(pathname)) {
        router.push('/signin')
      }
    }

    checkAuth()
  }, [router, pathname])
}
