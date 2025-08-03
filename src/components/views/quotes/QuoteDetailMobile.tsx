'use client'

import Link from 'next/link'
import { Quote } from '@/types/quote'

type Props = {
  quote: Quote
  onConvert: () => void
  onViewPdf: () => void
  onSendEmail: () => void
}

export default function QuoteDetailMobile({ quote, onConvert, onViewPdf, onSendEmail }: Props) {
  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-4">
      <h1 className="text-xl font-bold text-center">Quote Details</h1>

      <div className="bg-white p-4 rounded shadow space-y-2">
        <p><strong>Reference:</strong> {quote.reference || quote.id}</p>
        <p><strong>Client:</strong> {quote.client_name}</p>
        <p><strong>Total:</strong> R {quote.total.toFixed(2)}</p>
        <p><strong>Status:</strong> {quote.status}</p>
      </div>

      <div className="flex flex-col gap-2">
        {quote.status !== 'converted' && (
          <button onClick={onConvert} className="bg-green-600 text-white px-4 py-2 rounded">
            Convert
          </button>
        )}
        <button onClick={onViewPdf} className="bg-blue-600 text-white px-4 py-2 rounded">
          View PDF
        </button>
        <button onClick={onSendEmail} className="bg-gray-800 text-white px-4 py-2 rounded">
          Send Email
        </button>
        <Link href="/client-dashboard/quotes">
          <button className="bg-gray-600 text-white px-4 py-2 rounded">
            Back
          </button>
        </Link>
      </div>
    </div>
  )
}
