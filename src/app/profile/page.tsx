'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import Header from '@/components/Header'

interface Profile {
  full_name: string
  company_name: string
  phone: string
  address: string
  vat_number: string
  currency: 'ZAR' | 'USD'
  vat_inclusive: boolean
  logo_url: string
  updated_at?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [logo, setLogo] = useState<string>('/default-logo.png')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/signin')

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) {
        console.error(error)
        return
      }

      if (data?.logo_url) {
        const { data: signed } = await supabase
          .storage.from('logos')
          .createSignedUrl(data.logo_url, 86400)
        setLogo(signed?.signedUrl ?? '/default-logo.png')
      }

      setProfile({
        full_name: data.full_name ?? '',
        company_name: data.company_name ?? '',
        phone: data.phone ?? '',
        address: data.address ?? '',
        vat_number: data.vat_number ?? '',
        currency: data.currency ?? 'ZAR',
        vat_inclusive: data.vat_inclusive ?? true,
        logo_url: data.logo_url ?? '',
        updated_at: data.updated_at ?? undefined
      })

      setLoading(false)
    }

    loadProfile()
  }, [router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-black">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Header />
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow mt-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Your Profile</h1>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          <img
            src={logo}
            alt="Logo"
            className="w-32 h-32 border rounded object-contain bg-white"
          />

          <div className="space-y-3 flex-1">
            <Info label="Full Name" value={profile?.full_name ?? ''} />
            <Info label="Company" value={profile?.company_name ?? ''} />
            <Info label="Phone" value={profile?.phone ?? ''} />
            <Info label="Address" value={profile?.address ?? ''} />
            <Info label="VAT Number" value={profile?.vat_number ?? '—'} />
            <Info label="Currency" value={profile?.currency === 'USD' ? 'USD ($)' : 'ZAR (R)'} />
            <Info label="VAT Inclusive" value={profile?.vat_inclusive ? 'Yes' : 'No'} />
            {profile?.updated_at && <Info label="Last Updated" value={new Date(profile.updated_at).toLocaleString()} />}
          </div>
        </div>

        <div className="mt-6 text-center space-y-2">
          <Link href="/profile/edit-profile" className="text-blue-600 hover:underline block">Edit Profile</Link>
          <Link href="/client-dashboard/settings" className="text-blue-600 hover:underline block">VAT Settings</Link>
        </div>
      </div>
    </div>
  )
}
  

function Info({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="font-semibold">{label}:</span> {value ?? ''}
    </p>
  )
}
