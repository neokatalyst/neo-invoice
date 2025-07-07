'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import jsPDF from 'jspdf'

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<any[]>([])

  useEffect(() => {
    const fetchInvoices = async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user?.id) return

      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', userData.user.id)

      if (error) console.error('Error fetching invoices:', error)
      else setInvoices(data || [])
    }

    fetchInvoices()
  }, [])

  const handleGeneratePDF = async (invoice: any) => {
    const doc = new jsPDF()
    doc.text(`Invoice for ${invoice.client_name}`, 10, 10)
    doc.text(`Amount: R${invoice.amount}`, 10, 20)

    const blob = doc.output('blob')
    const file = new File([blob], `invoice-${invoice.id}.pdf`, {
      type: 'application/pdf',
    })

    const { data: user } = await supabase.auth.getUser()
    const path = `invoices/${user.user?.id}/invoice-${invoice.id}.pdf`

    const { error: uploadErr } = await supabase.storage
      .from('invoices')
      .upload(path, file, { upsert: true })

    if (uploadErr) {
      console.error('Upload failed:', uploadErr)
      return
    }

    const { data: signedUrlData, error: urlErr } = await supabase.storage
      .from('invoices')
      .createSignedUrl(path, 3600)

    if (urlErr) {
      console.error('URL error:', urlErr)
      return
    }

    await supabase.from('invoices').update({ pdf_url: signedUrlData.signedUrl }).eq('id', invoice.id)
    alert('PDF generated and uploaded!')
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Invoices</h1>
      {invoices.map((invoice) => (
        <div key={invoice.id} className="border p-4 mb-3 rounded">
          <p>Client: {invoice.client_name}</p>
          <p>Amount: R{invoice.amount}</p>
          <p>Status: {invoice.status}</p>
          {invoice.pdf_url ? (
            <a href={invoice.pdf_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
              View PDF
            </a>
          ) : (
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded mt-2"
              onClick={() => handleGeneratePDF(invoice)}
            >
              Generate PDF
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
