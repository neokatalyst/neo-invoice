'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

type Profile = {
  id: string
  full_name: string
  email: string
  role: string
  company_name: string
}

export default function UserListPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        setError('Unable to fetch current user')
        setLoading(false)
        return
      }

      const { data: currentProfile, error: profileError } = await supabase
        .from('profiles')
        .select('organisation_id')
        .eq('id', user.id)
        .single()

      if (profileError || !currentProfile) {
        setError('Could not fetch profile or organisation ID')
        setLoading(false)
        return
      }

      const { data: userList, error: listError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, company_name')
        .eq('organisation_id', currentProfile.organisation_id)

      if (listError) {
        setError('Failed to fetch users')
        setLoading(false)
        return
      }

      setUsers(userList || [])
      setLoading(false)
    }

    fetchUsers()
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Team Members</h1>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <table className="w-full table-auto border border-gray-300 rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Company</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-gray-200">
                <td className="p-3">{u.full_name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{u.company_name}</td>
                <td className="p-3">
                  <Link href={`/client-dashboard/profile/users/view/${u.id}`}>
                    <button className="text-blue-600 hover:underline">View</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

<div className="mt-6">
  <Link href="/client-dashboard/profile/users/invite">
    <button className="bg-green-800 text-white px-4 py-2 rounded">
      + Invite User
    </button>
  </Link>

<div className="mt-6"></div>
  <Link href="/profile">
        <button className="bg-gray-800 text-white px-4 py-2 rounded">
          View Profile
        </button>
</Link>
</div>


    </div>
  )
}
