// app/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function HomeRedirect() {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        const role = session.user.user_metadata.role
        const org = session.user.user_metadata.organisation_id
        if (role === 'admin' || role === 'superadmin') {
          router.push('/landing')
                  } else if (org) {
          router.push('/client-dashboard')
        } else if (org) {
          router.push('/admin-dashboard')
        } else {
          router.push('/settings')
        }
      } else {
        router.push('/signin')
      }
    }

    checkSession()
  }, [router])

  return null
}
