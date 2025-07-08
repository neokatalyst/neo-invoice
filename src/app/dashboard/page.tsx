'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { generateInvoicePdf } from '@/lib/generateInvoicePDF'
import { generateAndUploadInvoicePdf } from '@/lib/uploadInvoicePdf'

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

  if (error) return <div>Error: {error}</div>

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
              <p><strong>Client:</strong> {invoice.client_name}</p>
              <p><strong>Email:</strong> {invoice.client_email}</p>
              <p><strong>Amount:</strong> R{invoice.amount}</p>
              <p><strong>Status:</strong> {invoice.status}</p>
              <p><strong>Created:</strong> {new Date(invoice.created_at).toLocaleString()}</p>

              <div className="mt-4 space-x-2">
                <button
                  onClick={() => {
                    const doc = generateInvoicePdf(invoice)
                    doc.save(`invoice-${invoice.id}.pdf`)
                  }}
                  className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Download PDF
                </button>

                <button
                  onClick={async () => {
                    try {
                      const url = await generateAndUploadInvoicePdf(invoice)
                      alert('✅ PDF uploaded!\n' + url)
                    } catch (err) {
                      console.error('❌ Upload failed:', err)
                      alert('Error uploading PDF')
                    }
                  }}
                  className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Upload to Supabase
                </button>

                {invoice.pdf_url && (
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/getSignedUrl', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            path: `invoices/invoice-${invoice.client_name
                              .toLowerCase()
                              .replace(/\s+/g, '_')}-${invoice.id}-${new Date(
                              invoice.created_at
                            ).getTime()}.pdf`,
                          }),
                        })

                        const { url } = await res.json()
                        if (url) {
                          window.open(url, '_blank')
                        } else {
                          throw new Error('Signed URL not returned')
                        }
                      } catch (err) {
                        console.error('Failed to open signed URL:', err)
                        alert('Could not open invoice PDF')
                      }
                    }}
                    className="mt-2 inline-block px-4 py-1 bg-gray-700 text-white rounded hover:bg-gray-800"
                  >
                    View Invoice
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
