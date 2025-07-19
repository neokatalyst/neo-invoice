'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Header from '@/components/Header'
import Link from 'next/link'

export default function ViewProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [logoUrl, setLogoUrl] = useState<string>('/default-logo.png')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/signin')

      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (error) setError(error.message)
      if (data) {
        setProfile(data)

        if (data.logo_url) {
          const { data: signed } = await supabase
            .storage.from('logos')
            .createSignedUrl(data.logo_url, 60 * 60 * 24 * 7)

          if (signed?.signedUrl) setLogoUrl(signed.signedUrl)
        }
      }
      setLoading(false)
    }

    fetchProfile()
  }, [router])

  if (loading) return <div className="p-10 text-center">Loading profile...</div>
  if (error) return <div className="p-10 text-center text-red-600">Error: {error}</div>

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6 text-center">Your Profile</h1>

        <div className="bg-white p-6 rounded shadow space-y-3 text-left">
          <Display label="Full Name" value={profile.full_name} />
          <Display label="Company" value={profile.company_name} />
          <Display label="Phone" value={profile.phone} />
          <Display label="Address" value={profile.address} />
          <Display label="VAT Number" value={profile.vat_number} />

          <div>
            <p className="font-medium mb-1">Logo</p>
            <img src={logoUrl} alt="Logo" className="max-h-24 object-contain border rounded" />
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/profile" className="text-blue-600 hover:underline">
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  )
}

const Display = ({ label, value }: { label: string; value: string | null }) => (
  <p><span className="font-medium">{label}:</span> {value?.trim() || 'N/A'}</p>
)
