'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { first_name, last_name, email, password } = formData

    if (!first_name || !last_name || !email || !password) {
      toast.error('All fields are required.')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    try {
      // Store for resend fallback
      localStorage.setItem('signup_name', JSON.stringify({ first_name, last_name }))
      localStorage.setItem('signup_email', email)
      localStorage.setItem('signup_password', password)

      const res = await fetch('/api/sendConfirmationEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name, last_name, email, password })
      })

      if (res.ok) {
        toast.success('Account created! Check your inbox to verify.')
        router.push('/auth/verify')
      } else {
        toast.error('Failed to sign up. Please try again.')
        console.error(await res.json())
      }
    } catch (err) {
      toast.error('Unexpected error. Please try again.')
      console.error(err)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Header />
      <div className="max-w-md mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required className="w-full border border-gray-300 p-2 rounded" />
          <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required className="w-full border border-gray-300 p-2 rounded" />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full border border-gray-300 p-2 rounded" />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full border border-gray-300 p-2 rounded" />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <Link href="/signin" className="text-blue-600 hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  )
}
