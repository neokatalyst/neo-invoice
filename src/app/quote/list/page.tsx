'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Header from '@/components/Header'
import toast from 'react-hot-toast'

export default function QuoteListPage() {
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuotes = async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) toast.error(error.message)
      if (data) setQuotes(data)
      setLoading(false)
    }

    fetchQuotes()
  }, [])

  const convertToInvoice = async (quote: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return toast.error('Not signed in')

    const { error } = await supabase.from('invoices').insert({
      quote_id: quote.id,
      user_id: user.id,
      client_name: quote.client_name,
      client_email: quote.client_email,
      items: quote.items,
      total: quote.total,
      status: 'unpaid'
    })

    if (error) {
      toast.error('Failed to convert: ' + error.message)
    } else {
      toast.success('Invoice created from quote!')
    }
  }

  if (loading) return <p className="text-center py-10">Loading quotes...</p>

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Header />
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Quotes</h1>

        {quotes.length === 0 ? (
          <p>No quotes found.</p>
        ) : (
          quotes.map((q) => (
            <div key={q.id} className="p-4 bg-white rounded shadow space-y-2">
              <p><span className="font-medium">Client:</span> {q.client_name}</p>
              <p><span className="font-medium">Email:</span> {q.client_email}</p>
              <p><span className="font-medium">Total:</span> R {q.total?.toFixed(2)}</p>
              <p><span className="font-medium">Status:</span> {q.status}</p>

              <button
                onClick={() => convertToInvoice(q)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Convert to Invoice
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
