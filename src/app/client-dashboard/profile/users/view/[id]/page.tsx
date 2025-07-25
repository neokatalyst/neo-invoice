'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'

type Profile = {
  id: string
  full_name: string
  email: string
  role: string
  phone: string
  address: string
  company_name: string
  vat_number: string | null
  logo_url: string | null
}

export default function ViewUserPage() {
  const { id } = useParams()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      if (!id || typeof id !== 'string') return

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('User fetch error:', error)
      } else {
        setProfile(data)

        if (data.logo_url) {
          const { data: signedUrlData } = await supabase.storage
            .from('logos')
            .createSignedUrl(data.logo_url, 60)

          setLogoUrl(signedUrlData?.signedUrl ?? '/default-logo.png')
        } else {
          setLogoUrl('/default-logo.png')
        }
      }

      setLoading(false)
    }

    fetchUser()
  }, [id])

  if (loading) return <p className="p-4">Loading...</p>
  if (!profile) return <p className="p-4 text-red-600">User not found.</p>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>

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
        <p><strong>Name:</strong> {profile.full_name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Role:</strong> {profile.role}</p>
        <p><strong>Phone:</strong> {profile.phone}</p>
        <p><strong>Address:</strong> {profile.address}</p>
        <p><strong>Company:</strong> {profile.company_name}</p>
        <p><strong>VAT Number:</strong> {profile.vat_number || 'N/A'}</p>
      </div>
    </div>
  )
}
