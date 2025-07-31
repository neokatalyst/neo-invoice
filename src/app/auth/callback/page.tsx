'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const hash = window.location.hash.substring(1)
      const params = new URLSearchParams(hash)

      const access_token = params.get('access_token')
      const refresh_token = params.get('refresh_token')
      const type = params.get('type')

      if (!access_token || !refresh_token) {
        toast.error('Missing authentication token')
        return
      }

      const {  error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      })

      if (error) {
        toast.error(error.message || 'Authentication failed')
      } else {
        if (type === 'signup') {
          toast.success('Email confirmed! Welcome 🎉')
          router.push('/profile/edit-profile') // force onboarding
        } else {
          toast.success('Signed in successfully!')
          router.push('/')
        }
      }
    }

    handleCallback()
  }, [router])

  return <p className="p-4 text-center">Confirming your email...</p>
}
