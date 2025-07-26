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

  return (
    <td className="p-3 flex gap-3">
      <button onClick={handlePreview} className="text-blue-600 hover:underline">
        Preview
      </button>
      <button onClick={handleDownload} className="text-green-600 hover:underline">
        Download
      </button>
    </td>
  )
}
