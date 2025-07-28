'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function ConfirmedPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [showResend, setShowResend] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        toast.success('Email confirmed! You’re now signed in.')
        router.push('/profile')
      } else {
        setShowResend(true)
        setChecking(false)
        toast.error('Session not found. Please try signing in again or resend the link.')
      }
    }

    checkSession()
  }, [router])

  const handleResend = async () => {
    const email = localStorage.getItem('signup_email')
    if (!email) {
      toast.error('No email found. Please sign up again.')
      router.push('/signup')
      return
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email
    })

    if (error) {
      toast.error('Failed to resend confirmation.')
    } else {
      toast.success('Confirmation email resent.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow text-center w-full max-w-md">
        <div className="mb-4">
          <Image
            src="/logo.png" // 🔁 Replace with your Neo-Invoice logo path
            alt="Neo-Invoice Logo"
            width={80}
            height={80}
            className="mx-auto"
          />
        </div>

        <h1 className="text-xl font-bold mb-2 text-gray-800">Verifying your email…</h1>

        {checking ? (
          <div className="mt-4 flex items-center justify-center">
            <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-4">Could not verify session. You may try signing in or resend the confirmation email below.</p>

            {showResend && (
              <button
                onClick={handleResend}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Resend Confirmation Email
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
