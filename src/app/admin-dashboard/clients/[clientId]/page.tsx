'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function AdminClientDetailPage() {
  const { clientId } = useParams() as { clientId: string }
  const [profile, setProfile] = useState<any | null>(null)
  const [invoiceCount, setInvoiceCount] = useState<number>(0)
  const [quoteCount, setQuoteCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClientData = async () => {
      setLoading(true)

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', clientId)
        .single()

      if (profileError) toast.error('Failed to fetch profile')
      else setProfile(profileData)

      const { count: invoices } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', clientId)

      const { count: quotes } = await supabase
        .from('quotes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', clientId)

      setInvoiceCount(invoices || 0)
      setQuoteCount(quotes || 0)
      setLoading(false)
    }

    fetchClientData()
  }, [clientId])

  if (loading) return <p className="p-4">Loading client data...</p>
  if (!profile) return <p className="p-4 text-red-600">Client not found.</p>

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold mb-4">Client: {profile.company_name || profile.full_name}</h1>

      <div className="bg-white rounded shadow p-4 space-y-2">
        <Detail label="Full Name" value={profile.full_name} />
        <Detail label="Email" value={profile.email} />
        <Detail label="Company" value={profile.company_name} />
        <Detail label="Phone" value={profile.phone} />
        <Detail label="Address" value={profile.address} />
        <Detail label="VAT Number" value={profile.vat_number} />
        <Detail label="Last Updated" value={profile.updated_at ? new Date(profile.updated_at).toLocaleString() : 'N/A'} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="Invoices" count={invoiceCount} link={`/admin-dashboard/invoices?client_id=${clientId}`} />
        <StatCard title="Quotes" count={quoteCount} link={`/admin-dashboard/quotes?client_id=${clientId}`} />
      </div>

      <div className="flex space-x-4 pt-6">
        <Link href={`/profile/${clientId}`} className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">View Client Profile</Link>
        <Link href={`/admin-dashboard/clients/${clientId}/edit`} className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700">Edit Profile</Link>
      </div>
    </div>
  )
}

const Detail = ({ label, value }: { label: string; value: string | null }) => (
  <p><span className="font-medium">{label}:</span> {value?.trim() || 'N/A'}</p>
)

const StatCard = ({ title, count, link }: { title: string; count: number; link: string }) => (
  <Link href={link} className="bg-white rounded shadow p-6 text-center hover:shadow-lg transition block">
    <h2 className="text-lg font-medium">{title}</h2>
    <p className="text-4xl font-bold mt-2">{count}</p>
    <p className="text-blue-600 mt-2 underline text-sm">View {title}</p>
  </Link>
)
