'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (session) {
        toast.success('Email confirmed!')
        router.push('/profile')
      } else {
        toast.error(error?.message || 'Could not confirm email')
      }
    }

    handleAuth()
  }, [])

  return <p>Confirming your email...</p>
}
