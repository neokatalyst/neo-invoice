'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Header from '@/components/Header'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Script from 'next/script'

const RUNTIME_ENV = process.env.NEXT_PUBLIC_RUNTIME_ENV
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

export default function Page() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isBrowser, setIsBrowser] = useState(false)

  const router = useRouter()
  const IS_PROD = RUNTIME_ENV === 'production' && isBrowser

  useEffect(() => {
    setIsBrowser(typeof window !== 'undefined')

    if (typeof window !== 'undefined') {
      const handler = (e: any) => setCaptchaToken(e.detail)
      window.addEventListener('captcha-success', handler)
      return () => window.removeEventListener('captcha-success', handler)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (IS_PROD && !captchaToken) {
      toast.error('Please complete the CAPTCHA challenge.')
      return
    }

    setLoading(true)

    if (IS_PROD) {
      const verifyRes = await fetch('/api/verifyCaptcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: captchaToken }),
      })

      const result = await verifyRes.json()
      if (!result.success) {
        toast.error('CAPTCHA verification failed')
        setLoading(false)
        return
      }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Signed in successfully!')
      router.push('/')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Header />

      {IS_PROD && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          async
          defer
        />
      )}

      <div className="max-w-md mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />

          {IS_PROD && (
            <div className="pt-2">
              <div
                className="cf-turnstile"
                data-sitekey={TURNSTILE_SITE_KEY}
                data-callback="onTurnstileSuccess"
              />
              <Script id="turnstile-callback">
                {`
                  function onTurnstileSuccess(token) {
                    window.dispatchEvent(new CustomEvent("captcha-success", { detail: token }));
                  }
                `}
              </Script>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don’t have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up here
          </Link>
        </p>
        <p className="text-center text-sm mt-4">
          Forgot password?{' '}
          <Link href="/forgot-password" className="text-blue-600 text-sm">
            Forgot password
          </Link>
        </p>
      </div>
    </div>
  )
}
