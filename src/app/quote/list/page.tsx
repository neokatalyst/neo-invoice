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

  const sendEmail = async (quoteId: string) => {
    toast.promise(
      fetch('/api/sendQuoteEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quote_id: quoteId }),
      }).then(async res => {
        const result = await res.json()
        if (!res.ok) throw new Error(result.error || 'Failed to send email')
        return result.message
      }),
      {
        loading: 'Sending quote...',
        success: 'Email sent!',
        error: (err) => err.message || 'Error sending email',
      }
    )
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

              <div className="space-x-2">
                <button
                  onClick={() => sendEmail(q.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Send Quote
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
