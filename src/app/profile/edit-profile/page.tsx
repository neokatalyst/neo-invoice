'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Header from '@/components/Header'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function Page() {
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
    currency: 'ZAR',
    vat_inclusive: true,
  })
  const [logoPreview, setLogoPreview] = useState<string>('/default-logo.png')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/signin')

      const { data, error } = await supabase.from('profiles').select('*').eq('user_id', user.id).single()
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
          currency: data.currency ?? 'ZAR',
          vat_inclusive: data.vat_inclusive ?? true,
        })

        if (data.logo_url) {
          const { data: signed } = await supabase
            .storage.from('logos')
            .createSignedUrl(data.logo_url, 60 * 60 * 24 * 7)
          setLogoPreview(signed?.signedUrl ?? '/default-logo.png')
        }
      }
      setLoading(false)
    }
    fetchProfile()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target
    const { name, type } = target
    const newValue = type === 'checkbox' && 'checked' in target ? (target as HTMLInputElement).checked : target.value
    setProfile(prev => ({
      ...prev,
      [name]: newValue
    }))
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const filePath = `${user.id}/${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error('Failed to upload logo');
      return;
    }

    setProfile((prev) => ({ ...prev, logo_url: filePath }));

    const { data: signed, error: signedError } = await supabase
      .storage.from('logos')
      .createSignedUrl(filePath, 60 * 60 * 24 * 7);

    if (signedError) {
      toast.error('Logo uploaded but preview failed');
      setLogoPreview('/default-logo.png');
    } else {
      setLogoPreview(signed?.signedUrl ?? '/default-logo.png');
      toast.success('Logo uploaded');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return toast.error('User not signed in')

    const full_name = profile.full_name.trim() || `${profile.first_name} ${profile.last_name}`.trim()

    const updates = {
      user_id: user.id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      full_name,
      company_name: profile.company_name,
      phone: profile.phone,
      address: profile.address,
      vat_number: profile.vat_number,
      logo_url: profile.logo_url,
      currency: profile.currency,
      vat_inclusive: profile.vat_inclusive,
      updated_at: new Date().toISOString(),
    }

    const { error: updateError } = await supabase.from('profiles').upsert(updates)

    if (updateError) {
      setError(updateError.message)
      toast.error(updateError.message)
      setLoading(false)
      return
    }

    const orgId = profile.company_name.trim().toLowerCase().replace(/\s+/g, '-')
    const { error: metaError } = await supabase.auth.updateUser({
      data: {
        role: 'admin',
        organisation_id: orgId,
      }
    })

    if (metaError) {
      toast.error('Metadata update failed: ' + metaError.message)
    } else {
      toast.success('Profile and metadata updated successfully')
    }

    if (profile.logo_url) {
      const { error: invoiceUpdateError } = await supabase
        .from('invoices')
        .update({ logo_url: profile.logo_url })
        .eq('user_id', user.id)

      if (invoiceUpdateError) {
        console.warn('⚠️ Failed to update invoices with new logo:', invoiceUpdateError.message)
      }

      const { error: quoteUpdateError } = await supabase
        .from('quotes')
        .update({ logo_url: profile.logo_url })
        .eq('user_id', user.id)

      if (quoteUpdateError) {
        console.warn('⚠️ Failed to update quotes with new logo:', quoteUpdateError.message)
      }
    }

    router.push('/profile')
    setLoading(false)
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
          <Input label="Full Name (optional)" name="full_name" value={profile.full_name} onChange={handleChange} />
          <Input label="Company Name" name="company_name" value={profile.company_name} onChange={handleChange} />
          <Input label="Phone" name="phone" value={profile.phone} onChange={handleChange} type="tel" />
          <Textarea label="Address" name="address" value={profile.address} onChange={handleChange} />
          <Input label="VAT Number (optional)" name="vat_number" value={profile.vat_number} onChange={handleChange} />

          <div>
            <label className="block mb-1 font-medium">Currency</label>
            <select name="currency" value={profile.currency} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded">
              <option value="ZAR">ZAR (R)</option>
              <option value="USD">USD ($)</option>
              <option value="USD">EUR (€)</option>
              <option value="USD">GBP (£)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="vat_inclusive" checked={profile.vat_inclusive} onChange={handleChange} />
            <label className="font-medium">VAT Inclusive</label>
          </div>

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

        <div className="mt-6 text-center">
          <Link href="/profile" className="text-blue-600 hover:underline">View Profile</Link>
        </div>
      </div>
    </div>
  )
}

const Input = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <label className="block mb-1 font-medium">{label}</label>
    <input {...props} value={props.value ?? ''} className="w-full border border-gray-300 p-2 rounded" />
  </div>
)

const Textarea = ({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <div>
    <label className="block mb-1 font-medium">{label}</label>
    <textarea {...props} value={props.value ?? ''} className="w-full border border-gray-300 p-2 rounded" rows={3} />
  </div>
)
