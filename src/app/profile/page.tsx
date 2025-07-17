'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { uploadLogo } from '@/lib/uploadLogo'
import Header from '@/components/Header'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function ProfilePage() {
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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/signin')

      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (error) setError(error.message)
      if (data) setProfile(data)

      setLoading(false)
    }
    fetchProfile()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return toast.error('User not signed in')

    const full_name = profile.full_name.trim() ||
      `${profile.first_name.trim()} ${profile.last_name.trim()}`.trim()

    const updates = {
      id: user.id,
      ...profile,
      full_name,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('profiles').upsert(updates)
    if (error) toast.error(error.message)
    else {
      toast.success('Profile updated!')
      router.push('/dashboard')
    }
    setLoading(false)
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    const file = e.target.files[0]
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return toast.error('Not signed in')

    toast.promise(
      (async () => {
        const url = await uploadLogo(file, user.id)
        const { error } = await supabase.from('profiles').upsert({
          id: user.id,
          logo_url: url,
          updated_at: new Date().toISOString(),
        })
        if (error) throw new Error(error.message)
        setProfile(prev => ({ ...prev, logo_url: url }))
        return url
      })(),
      {
        loading: 'Uploading logo...',
        success: 'Logo uploaded and saved!',
        error: 'Logo upload failed',
      }
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="First Name" name="first_name" value={profile.first_name} onChange={handleChange} required />
            <Input label="Last Name" name="last_name" value={profile.last_name} onChange={handleChange} required />
          </div>

          <Input label="Full Name (optional)" name="full_name" value={profile.full_name} onChange={handleChange} placeholder="Defaults to first + last name" />
          <Input label="Company Name" name="company_name" value={profile.company_name} onChange={handleChange} />
          <Input label="Phone" name="phone" value={profile.phone} onChange={handleChange} type="tel" />
          <Textarea label="Address" name="address" value={profile.address} onChange={handleChange} />
          <Input label="VAT Number (optional)" name="vat_number" value={profile.vat_number} onChange={handleChange} />
          <Input label="Logo URL (optional)" name="logo_url" value={profile.logo_url} onChange={handleChange} type="url" />

          <div>
            <label className="block mb-1 font-medium">Upload Logo</label>
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="w-full border border-gray-300 p-2 rounded" />
          </div>

          {profile.logo_url && (
            <div>
              <label className="block mb-1 font-medium">Logo Preview</label>
              <img src={profile.logo_url} alt="Logo preview" className="max-h-24 object-contain border rounded" />
            </div>
          )}

          {error && <p className="text-red-600">{error}</p>}

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/profile/view-profile" className="text-blue-600 hover:underline">View Profile</Link>
        </div>
      </div>
    </div>
  )
}

const Input = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <label className="block mb-1 font-medium">{label}</label>
    <input {...props} className="w-full border border-gray-300 p-2 rounded" />
  </div>
)

const Textarea = ({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <div>
    <label className="block mb-1 font-medium">{label}</label>
    <textarea {...props} className="w-full border border-gray-300 p-2 rounded" rows={3} />
  </div>
)
