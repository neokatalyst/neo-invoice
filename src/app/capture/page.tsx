'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useAuthRedirect } from '@/lib/useAuthRedirect'
import Header from '@/components/Header'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function Page() {
  useAuthRedirect() // ✅ Protect page

  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    total: '',
    status: 'unpaid',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { client_name, client_email, total, status } = formData

    // ✅ Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast.error('User not authenticated')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('invoices').insert([
      {
        client_name,
        client_email,
        total: parseFloat(total),
        status,
        created_at: new Date().toISOString(),
        user_id: user.id, // ✅ Required for RLS
      },
    ])

    if (error) {
      setError(error.message)
      toast.error(error.message)
    } else {
      toast.success('Invoice created successfully!')
      router.push('/client-dashboard/invoices')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Header />
      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Create New Invoice</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="client_name"
            placeholder="Client Name"
            value={formData.client_name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
          <input
            type="email"
            name="client_email"
            placeholder="Client Email"
            value={formData.client_email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
          <input
            type="number"
            name="total" // ✅ was "amount"
            placeholder="Total Amount"
            value={formData.total}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
          </select>

          {error && <p className="text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Saving...' : 'Create Invoice'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/client-dashboard/invoices"
            className="inline-block px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
