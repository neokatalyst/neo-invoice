'use client'

import { Quote } from '@/types/quote'
import Link from 'next/link'
import { format } from 'date-fns'

export default function QuoteListDesktop({ quotes }: { quotes: Quote[] }) {
  const totalQuotes = quotes.length
  const convertedQuotes = quotes.filter(q => q.status === 'converted').length
  const pendingQuotes = quotes.filter(q => q.status === 'pending').length
  const declinedQuotes = quotes.filter(q => q.status === 'declined').length

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Quotes" value={totalQuotes} />
        <StatCard label="Converted" value={convertedQuotes} color="green" />
        <StatCard label="Pending" value={pendingQuotes} color="yellow" />
        <StatCard label="Declined" value={declinedQuotes} color="red" />
      </div>

      <h1 className="text-2xl font-bold mb-4">All Quotes</h1>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-200 rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Reference</th>
              <th className="p-3 text-left">Client</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left">Linked Invoice</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote) => (
              <tr key={quote.id} className="border-t border-gray-100">
                <td className="p-3">{quote.reference || quote.id.slice(0, 8)}</td>
                <td className="p-3">{quote.client_name}</td>
                <td className="p-3">R {quote.total.toFixed(2)}</td>
                <td className="p-3 capitalize">{quote.status}</td>
                <td className="p-3">{format(new Date(quote.created_at), 'dd MMM yyyy')}</td>
                <td className="p-3">
                  {quote.invoice_id ? (
                    <Link href={`/client-dashboard/invoices/view/${quote.invoice_id}`}>
                      <span className="text-purple-600 hover:underline">View Invoice</span>
                    </Link>
                  ) : (
                    <span className="text-gray-400 italic">None</span>
                  )}
                </td>
                <td className="p-3 space-y-1 flex flex-col">
                  <Link href={`/client-dashboard/quotes/view/${quote.id}`}>
                    <button className="text-blue-600 hover:underline">View</button>
                  </Link>
                  {quote.status === 'pending' && (
                    <Link href={`/client-dashboard/quotes/respond?quote_id=${quote.id}`}>
                      <button className="text-green-600 hover:underline">Respond</button>
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatCard({ label, value, color = 'gray' }: { label: string, value: number, color?: string }) {
  return (
    <div className={`bg-${color}-100 p-4 rounded shadow text-center`}>
      <h2 className="text-lg font-bold">{label}</h2>
      <p className={`text-2xl text-${color}-700`}>{value}</p>
    </div>
  )
}
