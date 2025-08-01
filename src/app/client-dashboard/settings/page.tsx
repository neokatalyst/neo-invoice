'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'
import Link from 'next/link'
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser()

      if (authError || !user) {
        toast.error('Not signed in')
        return
      }

      setUser(user)

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (profileError) {
        toast.error('Could not load profile')
        return
      }

      setProfile(profile)
    }

    fetchData()
  }, [])

  const handleSaveSettings = async () => {
    if (!user || !profile) return

    setLoading(true)

    const updates = {
      currency: profile.currency,
      vat_inclusive: profile.vat_inclusive,
      vat_rate: profile.vat_rate,
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id)

    setLoading(false)

    if (error) {
      toast.error('Failed to save settings')
    } else {
      toast.success('Settings updated successfully')
    }
  }

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const target = e.target
  const { name, type } = target

  const newValue =
    type === 'checkbox' && 'checked' in target
      ? (target as HTMLInputElement).checked
      : target.value

  setProfile((prev: any) => ({
    ...prev,
    [name]: newValue
  }))
}


  const content = (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      {/* Account Info */}
      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Account Info</h2>
        {user ? (
          <>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.user_metadata?.role || 'N/A'}</p>
          </>
        ) : (
          <p>Loading account info...</p>
        )}
      </section>

      {/* Company Info & VAT Settings */}
      <section className="bg-white p-4 rounded shadow space-y-2">
        <h2 className="text-lg font-semibold mb-2">Company Profile & VAT</h2>
        {profile ? (
          <>
            <p><strong>Company:</strong> {profile.company_name}</p>
            <p><strong>VAT Number:</strong> {profile.vat_number || 'N/A'}</p>
            <p><strong>Phone:</strong> {profile.phone}</p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block font-medium mb-1">Currency</label>
                <select
                  name="currency"
                  value={profile.currency}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                >
                  <option value="ZAR">ZAR (R)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">VAT Rate (%)</label>
                <input
                  type="number"
                  name="vat_rate"
                  value={profile.vat_rate ?? 15}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="vat_inclusive"
                  checked={profile.vat_inclusive}
                  onChange={handleChange}
                />
                <label className="font-medium">VAT Inclusive</label>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={handleSaveSettings}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save VAT Settings'}
              </button>

              <Link href="/client-dashboard/profile/edit">
                <button className="bg-gray-100 border border-gray-300 px-4 py-2 rounded hover:bg-gray-200">
                  Edit Full Profile
                </button>
              </Link>
            </div>
          </>
        ) : (
          <p>Loading profile...</p>
        )}
      </section>

      {/* Subscription Info */}
      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Subscription</h2>
        <p>You are currently on the <strong>Free</strong> plan.</p>
        <button
          className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          disabled
        >
          Upgrade (Coming Soon)
        </button>
      </section>

      {/* Danger Zone */}
      <section className="bg-white p-4 rounded shadow border border-red-200">
        <h2 className="text-lg font-semibold mb-2 text-red-600">Danger Zone</h2>
        <p className="text-sm text-red-600">Deleting your account is permanent and cannot be undone.</p>
        <button
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          disabled
        >
          Delete Account (Disabled)
        </button>
      </section>
    </div>
  )

  return <ResponsiveLayout mobile={content} tablet={content} desktop={content} />
}
