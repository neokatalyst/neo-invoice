'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Header from '@/components/Header'
import toast from 'react-hot-toast'
import { uploadLogo } from '@/lib/uploadLogo'

export default function EditProfilePage() {
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
  const [logoPreview, setLogoPreview] = useState<string>('/default-logo.png')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/signin')
        return
      }

      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (error) setError(error.message)
      if (data) {
        setProfile({
          first_name: data.first_name ?? '',
          last_name: data.last_name ?? '',
          full_name: data.full_name ?? '',
          company_name: data.company_name ?? '',
          phone: data.phone ?? '',
          address: data.address ?? '',
          vat_number: data.vat_number ?? '',
          logo_url: data.logo_url ?? '',
        })

        if (data.logo_url) {
          const { data: signed } = await supabase.storage.from('logos').createSignedUrl(data.logo_url, 60 * 60 * 24 * 7)
          setLogoPreview(signed?.signedUrl ?? '/default-logo.png')
        }
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

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('User not signed in')
      setLoading(false)
      return
    }

    const full_name = profile.full_name.trim() || `${profile.first_name} ${profile.last_name}`.trim()

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
      toast.success('Profile updated')
      router.push('/profile')
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
        setProfile(prev => ({ ...prev, logo_url: url }))
        const { data: signed } = await supabase.storage.from('logos').createSignedUrl(url, 60 * 60 * 24 * 7)
        setLogoPreview(signed?.signedUrl ?? '/default-logo.png')
      })(),
      {
        loading: 'Uploading logo...',
        success: 'Logo uploaded!',
        error: 'Failed to upload',
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

          <div>
            <label className="block mb-1 font-medium">Upload Logo</label>
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="w-full border border-gray-300 p-2 rounded" />
            <img src={logoPreview} alt="Logo preview" className="mt-4 max-h-24 object-contain border rounded" />
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}

const Input = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <label className="block mb-1 font-medium">{label}</label>
    <input
      {...props}
      value={props.value ?? ''}
      className="w-full border border-gray-300 p-2 rounded"
    />
  </div>
)


const Textarea = ({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <div>
    <label className="block mb-1 font-medium">{label}</label>
    <textarea {...props} className="w-full border border-gray-300 p-2 rounded" rows={3} />
  </div>
)
