'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'

export default function VerifyPage() {
  const [name, setName] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('signup_name')
    const emailStored = localStorage.getItem('signup_email')
    if (stored) {
      const { first_name } = JSON.parse(stored)
      setName(first_name)
    }
    if (emailStored) setEmail(emailStored)
  }, [])

  const handleResend = async () => {
    if (!email) {
      toast.error('No email found in local storage.')
      return
    }

    setResending(true)
    try {
      const res = await fetch('/api/sendConfirmationEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      if (res.ok) {
        toast.success('Confirmation email resent.')
      } else {
        toast.error(data.error || 'Failed to resend email.')
      }
    } catch {
      toast.error('Network error. Please try again.')
    }
    setResending(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#0b1d42] text-white">
      <Image src="/logo.png" alt="NeoKatalyst Logo" width={80} height={80} className="mb-4" />
      <h1 className="text-2xl font-semibold mb-2">
        Hi {name || 'there'}, please verify your email
      </h1>

      <p className="text-center max-w-sm mb-6 text-sm text-gray-200">
        We’ve sent a confirmation link to your email. Please check your inbox and confirm your account before continuing.
      </p>

      <button
        onClick={handleResend}
        disabled={resending}
        className="bg-white text-[#0b1d42] px-4 py-2 rounded hover:bg-gray-200 font-medium transition"
      >
        {resending ? 'Resending...' : 'Resend Confirmation Email'}
      </button>
    </div>
  )
}
