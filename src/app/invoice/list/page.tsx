'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Header from '@/components/Header'
import toast from 'react-hot-toast'

export default function InvoiceListPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvoices = async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) toast.error(error.message)
      if (data) setInvoices(data)
      setLoading(false)
    }

    fetchInvoices()
  }, [])

  if (loading) return <p className="text-center py-10">Loading invoices...</p>

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Header />
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Invoices</h1>

        {invoices.length === 0 ? (
          <p>No invoices found.</p>
        ) : (
          invoices.map((inv) => (
            <div key={inv.id} className="p-4 bg-white rounded shadow space-y-2">
              <p><span className="font-medium">Client:</span> {inv.client_name}</p>
              <p><span className="font-medium">Email:</span> {inv.client_email}</p>
              <p><span className="font-medium">Total:</span> R {inv.total?.toFixed(2)}</p>
              <p><span className="font-medium">Status:</span> {inv.status}</p>
              <p><span className="font-medium">Created:</span> {new Date(inv.created_at).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
