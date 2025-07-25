'use client'

import { useEffect, useState, ChangeEvent } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'
import toast from 'react-hot-toast'

type Profile = {
  id: string
  full_name: string
  role: string
  phone: string
  address: string
  company_name: string
  vat_number: string | null
  logo_url: string | null
}

export default function EditUserProfilePage() {
  const { id } = useParams()
  const router = useRouter()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id || typeof id !== 'string') return

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Fetch profile error:', error)
        toast.error('Could not load profile.')
        setLoading(false)
        return
      }

      setProfile(data)

      if (data.logo_url) {
        const { data: signedUrl } = await supabase.storage
          .from('logos')
          .createSignedUrl(data.logo_url, 60)

        setLogoUrl(signedUrl?.signedUrl ?? '/default-logo.png')
      }

      setLoading(false)
    }

    fetchProfile()
  }, [id])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (profile) {
      setProfile({ ...profile, [name]: value })
    }
  }

  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profile) return

    const filePath = `${profile.id}/${file.name}`

    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      console.error(uploadError)
      toast.error('Failed to upload logo.')
      return
    }

    const { data: signedUrl } = await supabase.storage
      .from('logos')
      .createSignedUrl(filePath, 60)

    setLogoUrl(signedUrl?.signedUrl ?? null)
    setProfile({ ...profile, logo_url: filePath })
    toast.success('Logo uploaded')
  }

  const handleSubmit = async () => {
    if (!profile) return

    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', profile.id)

    if (error) {
      console.error(error)
      toast.error('Failed to update profile')
    } else {
      toast.success('Profile updated')
      router.push('/client-dashboard/profile/users')
    }
  }

  if (loading) return <p className="p-4">Loading...</p>
  if (!profile) return <p className="p-4 text-red-600">User not found</p>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit User Profile</h1>

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        {logoUrl && (
          <div className="w-32 h-32 relative">
            <Image
              src={logoUrl}
              alt="Company Logo"
              fill
              className="object-contain border rounded"
            />
          </div>
        )}
        <label className="block">
          <span className="font-semibold">Upload Logo</span>
          <input type="file" accept="image/*" onChange={handleLogoUpload} className="mt-1" />
        </label>

        <label className="block">
          <span className="font-semibold">Full Name</span>
          <input
            type="text"
            name="full_name"
            value={profile.full_name}
            onChange={handleChange}
            className="mt-1 block w-full border rounded p-2"
          />
        </label>

        <label className="block">
          <span className="font-semibold">Role</span>
          <input
            type="text"
            name="role"
            value={profile.role}
            onChange={handleChange}
            className="mt-1 block w-full border rounded p-2"
          />
        </label>

        <label className="block">
          <span className="font-semibold">Phone</span>
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="mt-1 block w-full border rounded p-2"
          />
        </label>

        <label className="block">
          <span className="font-semibold">Address</span>
          <textarea
            name="address"
            value={profile.address}
            onChange={handleChange}
            className="mt-1 block w-full border rounded p-2"
          />
        </label>

        <label className="block">
          <span className="font-semibold">Company Name</span>
          <input
            type="text"
            name="company_name"
            value={profile.company_name}
            onChange={handleChange}
            className="mt-1 block w-full border rounded p-2"
          />
        </label>

        <label className="block">
          <span className="font-semibold">VAT Number</span>
          <input
            type="text"
            name="vat_number"
            value={profile.vat_number ?? ''}
            onChange={handleChange}
            className="mt-1 block w-full border rounded p-2"
          />
        </label>

        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}
