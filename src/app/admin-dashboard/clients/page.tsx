'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'

export default function AdminClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('company_name', { ascending: true })

      if (error) {
        toast.error('Failed to load clients')
      } else {
        setClients(data || [])
      }

      setLoading(false)
    }

    fetchClients()
  }, [])

  if (loading) return <p className="p-4">Loading clients...</p>

  if (clients.length === 0) {
    return <p className="p-4 text-gray-600">No clients found.</p>
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold mb-4">Clients</h1>
      <div className="space-y-4">
        {clients.map((client) => (
          <Link
            key={client.id}
            href={`/admin-dashboard/clients/${client.id}`}
            className="block bg-white p-4 rounded shadow hover:shadow-md transition"
          >
            <div className="font-bold text-lg">{client.company_name || 'Unnamed Company'}</div>
            <div className="text-sm text-gray-700">{client.full_name} ({client.email || client.id})</div>
            <div className="text-sm text-gray-500">Last updated: {client.updated_at ? new Date(client.updated_at).toLocaleString() : 'N/A'}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
