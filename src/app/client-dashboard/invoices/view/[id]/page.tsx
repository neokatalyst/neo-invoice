'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function InvoiceDetailPage() {
  const { id } = useParams()
  const [invoice, setInvoice] = useState<any>(null)

  useEffect(() => {
    const fetchInvoice = async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        toast.error('Invoice not found')
        return
      }

      setInvoice(data)
    }

    fetchInvoice()
  }, [id])

  if (!invoice) return <p className="p-10 text-center">Loading invoice...</p>

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-4">Invoice Details</h1>

      <div className="mb-4">
        <p><strong>Reference:</strong> {invoice.reference || invoice.id.slice(0, 8)}</p>
        <p><strong>Client:</strong> {invoice.client_name}</p>
        <p><strong>Total:</strong> R {invoice.total.toFixed(2)}</p>
        <p><strong>Status:</strong> {invoice.status}</p>
        <p><strong>Created:</strong> {format(new Date(invoice.created_at), 'dd MMM yyyy')}</p>
        {invoice.paid_at && (
          <p><strong>Paid:</strong> {format(new Date(invoice.paid_at), 'dd MMM yyyy')}</p>
        )}
      </div>

      <button
        onClick={() =>
          window.open(
            `${process.env.NEXT_PUBLIC_SUPABASE_FUNCTION_URL || `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1`}/generate-invoice-pdf?invoice_id=${invoice.id}`,
            '_blank'
          )
        }
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Download PDF
      </button>
    </div>
  )
}
