'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Link from 'next/link'

export default function ViewProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any | null>(null)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
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

        // ✅ Generate fresh signed URL for logo
        if (data.logo_url) {
          const { data: signedData } = await supabase
            .storage.from('logos')
            .createSignedUrl(data.logo_url, 60 * 60 * 24 * 7) // 7 days
          setLogoUrl(signedData?.signedUrl || null)
        }
      }
      setLoading(false)
    }
    fetchProfile()
  }, [router])

  if (loading) return <p className="text-center py-10">Loading...</p>
  if (error) return <p className="text-center text-red-600">{error}</p>

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6 text-center">View Profile</h1>

        <div className="bg-white p-6 rounded shadow space-y-3">
          <Info label="Full Name" value={profile.full_name} />
          <Info label="Company" value={profile.company_name} />
          <Info label="Phone" value={profile.phone} />
          <Info label="Address" value={profile.address} />
          <Info label="VAT Number" value={profile.vat_number} />

          {logoUrl && (
            <div>
              <p className="font-medium mb-1">Logo:</p>
              <img src={logoUrl} alt="Logo" className="max-h-24 object-contain border rounded" />
            </div>
          )}
        </div>

        <div className="mt-4 text-center">
          <Link href="/profile" className="text-blue-600 hover:underline">
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  )
}

const Info = ({ label, value }: { label: string, value: string | null }) => (
  <p><span className="font-medium">{label}:</span> {value?.trim() || 'N/A'}</p>
)
