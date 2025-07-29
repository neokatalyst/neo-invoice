'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
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
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { email, password, first_name, last_name } = formData

const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`,
    data: {
      first_name,
      last_name,
      role: 'admin',
      organisation_id: 'temp-org',
    },
  },
})


    if (error) {
      toast.error(error.message)
    } else {
      localStorage.setItem(
        'signup_name',
        JSON.stringify({ first_name, last_name })
      )

      toast.success('Account created! Complete your profile.')
      router.push('/profile')  // ✅ Sends to profile onboarding step
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
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
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
