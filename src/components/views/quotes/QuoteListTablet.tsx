'use client'

import { Quote } from '@/types/quote'
import Link from 'next/link'

export default function QuoteListTablet({ quotes }: { quotes: Quote[] }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quotes</h1>
        <Link href="/client-dashboard">
          <button className="bg-gray-800 text-white px-3 py-1 rounded">
            ← Dashboard
          </button>
        </Link>
      </div>

      {quotes.map((quote) => (
        <div key={quote.id} className="bg-white rounded shadow p-4 space-y-2">
          <p><strong>Reference:</strong> {quote.reference || quote.id.slice(0, 8)}</p>
          <p><strong>Client:</strong> {quote.client_name}</p>
          <p><strong>Total:</strong> R {quote.total.toFixed(2)}</p>

          <div className="flex gap-2 flex-wrap mt-2">
            <Link href={`/client-dashboard/quotes/view/${quote.id}`}>
              <button className="bg-blue-600 text-white px-3 py-1 rounded">View</button>
            </Link>
            {quote.status === 'pending' && (
              <Link href={`/client-dashboard/quotes/respond?quote_id=${quote.id}`}>
                <button className="bg-green-600 text-white px-3 py-1 rounded">Convert</button>
              </Link>
            )}
            <Link href={`/api/sendQuoteEmail?quote_id=${quote.id}`}>
              <button className="bg-gray-700 text-white px-3 py-1 rounded">Email</button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
