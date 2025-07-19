'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Header from '@/components/Header'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function QuoteListPage() {
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchQuotes = async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .neq('status', 'converted')
        .order('created_at', { ascending: false })

      if (error) toast.error(error.message)
      if (data) setQuotes(data)
      setLoading(false)
    }

    fetchQuotes()
  }, [])

  const convertToInvoice = async (quote: any) => {
    toast.loading('Converting...')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.dismiss()
      return toast.error('Not signed in')
    }

    const { error } = await supabase.from('invoices').insert({
      user_id: user.id,
      quote_id: quote.id,
      client_name: quote.client_name,
      items: quote.items,
      total: quote.total,
      status: 'unpaid',
    })

    if (error) {
      toast.dismiss()
      return toast.error('Failed to convert quote')
    }

    await supabase.from('quotes').update({ status: 'converted' }).eq('id', quote.id)
    toast.dismiss()
    toast.success('Converted to invoice')
    router.refresh()
  }

  const viewPdf = (quoteId: string) => {
    window.open(`/api/generateQuotePdf?quote_id=${quoteId}`, '_blank')
  }

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

  if (loading) return <p className="p-10 text-center">Loading quotes...</p>

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Header />
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Quotes</h1>

        {quotes.length === 0 ? (
          <p>No active quotes.</p>
        ) : (
          quotes.map((q) => (
            <div key={q.id} className="p-4 bg-white rounded shadow space-y-2">
              <p><span className="font-medium">Reference:</span> {q.reference}</p>
              <p><span className="font-medium">Client:</span> {q.client_name}</p>
              <p><span className="font-medium">Total:</span> R {q.total?.toFixed(2)}</p>
              <p><span className="font-medium">Status:</span> {q.status}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => convertToInvoice(q)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Convert to Invoice
                </button>
                <button
                  onClick={() => viewPdf(q.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  View PDF
                </button>
                <button
                  onClick={() => sendEmail(q.id)}
                  className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
                >
                  Send Email
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
