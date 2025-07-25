'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'
import Link from 'next/link'

type Invoice = {
  id: string
  reference: string | null
  client_name: string
  client_email: string
  total: number
  status: string
  created_at: string
  paid_at?: string | null
}

export default function InvoiceDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id || typeof id !== 'string') return

      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        toast.error('Invoice not found')
        return
      }

      setInvoice(data)
      setLoading(false)
    }

    fetchInvoice()
  }, [id])

  const viewPdf = () => {
    if (!invoice) return
    window.open(`/api/generateInvoicePdf?invoice_id=${invoice.id}`, '_blank')
  }

  const sendEmail = async () => {
    if (!invoice) return

    toast.promise(
      fetch('/api/sendInvoiceEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoice_id: invoice.id }),
      }).then(async res => {
        const result = await res.text()
        if (!res.ok) throw new Error(result || 'Failed to send email')
        return 'Email sent!'
      }),
      {
        loading: 'Sending invoice...',
        success: 'Email sent!',
        error: (err) => err.message || 'Error sending email',
      }
    )
  }

  const markAsPaid = async () => {
    if (!invoice) return

    const { error } = await supabase
      .from('invoices')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
      })
      .eq('id', invoice.id)

    if (error) {
      toast.error('Failed to mark as paid')
      console.error(error)
    } else {
      toast.success('Invoice marked as paid')
      router.refresh()
    }
  }

  if (loading) return <p className="p-10 text-center">Loading invoice...</p>
  if (!invoice) return <p className="p-10 text-center text-red-600">Invoice not found</p>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Invoice Detail</h1>

      <div className="bg-white p-4 rounded shadow space-y-2">
        <p><strong>Reference:</strong> {invoice.reference || invoice.id}</p>
        <p><strong>Client:</strong> {invoice.client_name}</p>
        <p><strong>Email:</strong> {invoice.client_email}</p>
        <p><strong>Total:</strong> R {invoice.total?.toFixed(2)}</p>
        <p><strong>Status:</strong> {invoice.status}</p>
        <p><strong>Created:</strong> {new Date(invoice.created_at).toLocaleDateString()}</p>
        {invoice.paid_at && (
          <p><strong>Paid On:</strong> {new Date(invoice.paid_at).toLocaleDateString()}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-6">
        <button
          onClick={viewPdf}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View PDF
        </button>
        <button
          onClick={sendEmail}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Send Email
        </button>
        {invoice.status !== 'paid' && (
          <button
            onClick={markAsPaid}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Confirm Payment Received
          </button>
        )}
        <Link href="/client-dashboard/invoices">
          <button className="bg-gray-600 text-white px-4 py-2 rounded">
            Return to Invoices
          </button>
        </Link>
      </div>
    </div>
  )
}
