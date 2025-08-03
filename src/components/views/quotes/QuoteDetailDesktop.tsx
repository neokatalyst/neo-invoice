'use client'

import Link from 'next/link'
import { Quote } from '@/types/quote'

type Props = {
  quote: Quote
  onConvert: () => void
  onViewPdf: () => void
  onSendEmail: () => void
}

export default function QuoteDetailDesktop({ quote, onConvert, onViewPdf, onSendEmail }: Props) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Quote Detail</h1>

      <div className="bg-white p-4 rounded shadow space-y-2">
        <p><strong>Reference:</strong> {quote.reference || quote.id}</p>
        <p><strong>Client:</strong> {quote.client_name}</p>
        <p><strong>Total:</strong> R {quote.total.toFixed(2)}</p>
        <p><strong>Status:</strong> {quote.status}</p>
        <p><strong>Created:</strong> {new Date(quote.created_at).toLocaleDateString()}</p>
        {quote.converted_at && (
          <p><strong>Converted:</strong> {new Date(quote.converted_at).toLocaleDateString()}</p>
        )}
      </div>

      <div className="flex gap-2 mt-6 flex-wrap">
        {quote.status !== 'converted' && (
          <button onClick={onConvert} className="bg-green-600 text-white px-4 py-2 rounded">
            Convert to Invoice
          </button>
        )}
        <button onClick={onViewPdf} className="bg-blue-600 text-white px-4 py-2 rounded">
          View PDF
        </button>
        <button onClick={onSendEmail} className="bg-gray-800 text-white px-4 py-2 rounded">
          Send Email
        </button>
        {quote.invoice_id && (
          <Link href={`/client-dashboard/invoices/view/${quote.invoice_id}`}>
            <button className="bg-purple-600 text-white px-4 py-2 rounded">
              View Invoice
            </button>
          </Link>
        )}
        <Link href="/client-dashboard/quotes">
          <button className="bg-gray-600 text-white px-4 py-2 rounded">
            Return to Quote Dashboard
          </button>
        </Link>
      </div>
    </div>
  )
}
