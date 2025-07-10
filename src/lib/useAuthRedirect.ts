'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from './supabaseClient'

export function useAuthRedirect() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      const publicRoutes = ['/signin', '/signup']
      const isPublic = publicRoutes.includes(pathname)

      if (!user && !isPublic) {
        // Not logged in, trying to access a protected route
        router.push('/signin')
      } else if (user && isPublic) {
        // Logged in, trying to access sign-in or sign-up
        router.push('/layout') // ✅ Only redirect to dashboard
      }
    }

    checkAuth()
  }, [router, pathname])
}
