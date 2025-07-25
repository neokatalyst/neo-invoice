'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'

export default function InviteUserPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('user')
  const [organisationId, setOrganisationId] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrgId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return toast.error('User not logged in')

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('organisation_id')
        .eq('id', user.id)
        .single()

      if (error || !profile) {
        toast.error('Could not fetch organisation')
        return
      }

      setOrganisationId(profile.organisation_id)
    }

    fetchOrgId()
  }, [])

  const handleInvite = async () => {
    if (!email || !fullName || !organisationId) {
      toast.error('Please complete all fields')
      return
    }

    const { error } = await supabase.from('profiles').insert({
      email,
      full_name: fullName,
      role,
      organisation_id: organisationId,
    })

    if (error) {
      console.error(error)
      toast.error('Failed to invite user')
      return
    }

    toast.success('User invited')
    router.push('/client-dashboard/profile/users')
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Invite New Team Member</h1>

      <div className="space-y-4">
        <label className="block">
          <span className="font-semibold">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border p-2 rounded"
          />
        </label>

        <label className="block">
          <span className="font-semibold">Full Name</span>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 block w-full border p-2 rounded"
          />
        </label>

        <label className="block">
          <span className="font-semibold">Role</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 block w-full border p-2 rounded"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <button
          onClick={handleInvite}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Invite User
        </button>
      </div>
    </div>
  )
}
