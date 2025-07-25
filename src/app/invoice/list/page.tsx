'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Header from '@/components/Header'
import toast from 'react-hot-toast'

export type Invoice = {
  id: string
  client_name: string
  client_email: string
  total: number
  status: string
  created_at: string
  reference?: string | null
}

export default function Page() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvoices = async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) toast.error(error.message)
      if (data) setInvoices(data as Invoice[])
      setLoading(false)
    }

    fetchInvoices()
  }, [])

  const viewPdf = (invoiceId: string) => {
    window.open(`/api/generateInvoicePdf?invoice_id=${invoiceId}`, '_blank')
  }

  const sendEmail = async (invoiceId: string) => {
    toast.promise(
      fetch('/api/sendInvoiceEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoice_id: invoiceId }),
      }).then(async res => {
  const result = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(result.error || result.message || 'Failed to send email')
  return 'Email sent!'
})
,
      {
        loading: 'Sending invoice...',
        success: 'Email sent!',
        error: (err) => err.message || 'Error sending email',
      }
    ).finally(() => {
      console.log(`✅ Email send request triggered for invoice ID: ${invoiceId}`)
    })
  }

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
              <p><span className="font-medium">Reference:</span> {inv.reference || 'N/A'}</p>
              <p><span className="font-medium">Client:</span> {inv.client_name}</p>
              <p><span className="font-medium">Email:</span> {inv.client_email}</p>
              <p><span className="font-medium">Total:</span> R {inv.total?.toFixed(2)}</p>
              <p><span className="font-medium">Status:</span> {inv.status}</p>
              <p><span className="font-medium">Created:</span> {new Date(inv.created_at).toLocaleDateString()}</p>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => viewPdf(inv.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  View PDF
                </button>
                <button
                  onClick={() => sendEmail(inv.id)}
                  className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
                >
                  Send Email
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
