'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Header from '@/components/Header'
import { useAuthRedirect } from '@/lib/useAuthRedirect'

export default function ProfilePage() {
  useAuthRedirect()
  const router = useRouter()

  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    full_name: '',
    company_name: '',
    phone: '',
    address: '',
    vat_number: '',
    logo_url: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

 useEffect(() => {
  const fetchProfile = async () => {
    setLoading(true)
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()

    if (!currentUser) {
      setLoading(false)
      router.push('/signin')
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.id)
      .single()

    // Pre-fill from signup if no profile exists yet
    if (!data && !error) {
      const cachedName = localStorage.getItem('signup_name')
      if (cachedName) {
        try {
          const parsed = JSON.parse(cachedName)
          setProfile(prev => ({
            ...prev,
            first_name: parsed.first_name || '',
            last_name: parsed.last_name || '',
            full_name: `${parsed.first_name || ''} ${parsed.last_name || ''}`.trim(),
          }))
          localStorage.removeItem('signup_name')
        } catch (err) {
          console.warn('Failed to parse signup_name from localStorage')
        }
      }
    }

    if (error && error.code !== 'PGRST116') {
      setError(error.message)
    } else if (data) {
      setProfile({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        full_name: data.full_name || '',
        company_name: data.company_name || '',
        phone: data.phone || '',
        address: data.address || '',
        vat_number: data.vat_number || '',
        logo_url: data.logo_url || '',
      })
    }

    setLoading(false)
  }

  fetchProfile()
}, [router])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast.error('User not signed in')
      return
    }

    const full_name =
      profile.full_name.trim() ||
      `${profile.first_name.trim()} ${profile.last_name.trim()}`.trim()

    const updates = {
      id: user.id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      full_name,
      company_name: profile.company_name,
      phone: profile.phone,
      address: profile.address,
      vat_number: profile.vat_number,
      logo_url: profile.logo_url,
      updated_at: new Date().toISOString(),
    }

    const { error: updateError } = await supabase.from('profiles').upsert(updates)

    if (updateError) {
      setError(updateError.message)
      toast.error(updateError.message)
    } else {
      toast.success('Profile updated successfully')
      router.push('/dashboard')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">First Name</label>
              <input
                type="text"
                name="first_name"
                value={profile.first_name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={profile.last_name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Full Name (optional)</label>
            <input
              type="text"
              name="full_name"
              value={profile.full_name}
              onChange={handleChange}
              placeholder="Defaults to first + last name"
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Company Name</label>
            <input
              type="text"
              name="company_name"
              value={profile.company_name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Address</label>
            <textarea
              name="address"
              value={profile.address}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">VAT Number (optional)</label>
            <input
              type="text"
              name="vat_number"
              value={profile.vat_number}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Logo URL (optional)</label>
            <input
              type="url"
              name="logo_url"
              value={profile.logo_url}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          {profile.logo_url && (
            <div className="mt-2">
              <label className="block mb-1 font-medium">Logo Preview</label>
              <img
                src={profile.logo_url}
                alt="Logo preview"
                className="max-h-24 object-contain border rounded"
              />
            </div>
          )}

          {error && <p className="text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}
