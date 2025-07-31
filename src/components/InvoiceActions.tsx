'use client'

import { downloadInvoiceFromFunction } from '@/lib/downloadInvoiceFromFunction'
import { previewInvoiceFromFunction } from '@/lib/previewInvoiceFromFunction'
import toast from 'react-hot-toast'

type Invoice = {
  id: string
  reference?: string | null
  client_name: string
  total: number
  status: string
  created_at: string
}

export default function InvoiceActions({ invoice }: { invoice: Invoice }) {
  const handleDownload = async () => {
    try {
      await downloadInvoiceFromFunction(invoice.id)
    } catch (err) {
      console.error(err)
      toast.error('Download failed')
    }
  }

  const handlePreview = async () => {
    try {
      await previewInvoiceFromFunction(invoice.id)
    } catch (err) {
      console.error(err)
      toast.error('Preview failed')
    }
  }

  const handleSend = async () => {
    const res = await fetch('/api/sendInvoiceEmail', {
      method: 'POST',
      body: JSON.stringify({ invoice_id: invoice.id }),
      headers: { 'Content-Type': 'application/json' },
    })

    if (res.ok) {
      toast.success('Invoice email sent')
    } else {
      toast.error('Failed to send invoice')
    }
  }

  return (
    <div className="flex gap-3">
      <button onClick={handlePreview} className="bg-blue-600 text-white px-4 py-2 rounded">
        Preview
      </button>
      <button onClick={handleDownload} className="bg-indigo-600 text-white px-4 py-2 rounded">
        Download
      </button>
      <button onClick={handleSend} className="bg-gray-800 text-white px-4 py-2 rounded">
        Email
      </button>
    </div>
  )
}




