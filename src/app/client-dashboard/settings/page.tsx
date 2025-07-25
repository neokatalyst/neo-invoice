'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

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
        .eq('id', user.id)
        .single()

      if (profileError) {
        toast.error('Could not load profile')
        return
      }

      setProfile(profile)
    }

    fetchData()
  }, [])

  return (
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

      {/* Company Info */}
      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Company Profile</h2>
        {profile ? (
          <>
            <p><strong>Company:</strong> {profile.company_name}</p>
            <p><strong>VAT Number:</strong> {profile.vat_number || 'N/A'}</p>
            <p><strong>Phone:</strong> {profile.phone}</p>
            <Link href="/client-dashboard/profile/edit">
              <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Edit Profile
              </button>
            </Link>
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
}
