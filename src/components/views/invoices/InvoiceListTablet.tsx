'use client'

import { format } from 'date-fns'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Invoice } from './InvoiceListDesktop'

export default function InvoiceListMobile({ invoices }: { invoices: Invoice[] }) {
  const sendInvoiceEmail = async (invoiceId: string) => {
    toast.promise(
      fetch('/api/sendInvoiceEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoice_id: invoiceId }),
      }).then(async res => {
        const result = await res.text()
        if (!res.ok) throw new Error(result || 'Failed to send email')
        return 'Email sent!'
      }),
      {
        loading: 'Sending...',
        success: 'Email sent!',
        error: (err) => err.message || 'Error sending email',
      }
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Invoices</h1>
        <Link href="/client-dashboard">
          <button className="bg-gray-800 text-white px-3 py-1 rounded text-sm">
            ← Dashboard
          </button>
        </Link>
      </div>

      {invoices.map((invoice) => (
        <div key={invoice.id} className="bg-white rounded shadow p-4 space-y-2">
          <p><strong>Reference:</strong> {invoice.reference || invoice.id.slice(0, 8)}</p>
          <p><strong>Client:</strong> {invoice.client_name}</p>
          <p><strong>Total:</strong> R {invoice.total?.toFixed(2) || '0.00'}</p>
          <p><strong>Status:</strong> {invoice.status}</p>
          <p><strong>Created:</strong> {format(new Date(invoice.created_at), 'dd MMM yyyy')}</p>
          <p>
            <strong>Paid:</strong>{' '}
            {invoice.paid_at
              ? format(new Date(invoice.paid_at), 'dd MMM yyyy')
              : <span className="text-gray-400 italic">Not Paid</span>}
          </p>

          <div className="flex gap-2 mt-2 flex-wrap">
            <Link href={`/client-dashboard/invoices/view/${invoice.id}`}>
              <button className="bg-blue-600 text-white px-3 py-1 rounded">View</button>
            </Link>
            <button
              onClick={() => sendInvoiceEmail(invoice.id)}
              className="bg-gray-700 text-white px-3 py-1 rounded"
            >
              Email
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
