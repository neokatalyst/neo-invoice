'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { data, error } = await supabase.from('invoices').select('*')
        if (error) throw error
        setInvoices(data || [])
      } catch (err: any) {
        console.error('Error fetching invoices:', err.message)
        setError(err.message)
      }
    }

    fetchInvoices()
  }, [])

  if (error) return <div className="text-red-500 p-4">Error: {error}</div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Invoices</h1>
      {invoices.length === 0 ? (
        <p className="text-gray-500">No invoices yet.</p>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white"
            >
              <p><strong>Client:</strong> {invoice.client_name} ({invoice.client_email})</p>
              <p><strong>Amount:</strong> R{invoice.amount}</p>
              <p><strong>Status:</strong> {invoice.status}</p>
              <p><strong>Created:</strong> {new Date(invoice.created_at).toLocaleString()}</p>
              {invoice.pdf_url && (
                <a
                  href={invoice.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View PDF
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
