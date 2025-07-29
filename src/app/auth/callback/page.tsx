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

      if (access_token && refresh_token) {
        const { data, error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        })

        if (error) {
          console.error('Error setting session:', error)
          toast.error('Could not sign you in.')
        } else {
          toast.success('Signed in successfully!')
          router.push('/profile') // or wherever you want them to land after verifying
        }
      } else {
        toast.error('Missing tokens.')
        router.push('/signin')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-700">
      <p>Verifying your session…</p>
    </div>
  )
}
