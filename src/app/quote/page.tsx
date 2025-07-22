'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Header from '@/components/Header'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Quote = {
  id: string
  reference: string | null
  client_name: string
  client_email: string
  total: number
  items: any[]
  status: string
  created_at: string
  converted_at?: string | null
  invoice_id?: string | null
}

export default function QuoteListPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchQuotes = async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select('id, reference, client_name, client_email, total, items, status, created_at, converted_at, invoice_id')
        .order('created_at', { ascending: false })

      if (error) toast.error(error.message)
      if (data) setQuotes(data as Quote[])
      setLoading(false)
    }

    fetchQuotes()
  }, [])

  const convertToInvoice = async (quote: Quote) => {
    toast.loading('Converting...')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return toast.error('Not signed in')

    const { data: invoice, error } = await supabase.from('invoices').insert({
      user_id: user.id,
      quote_id: quote.id,
      client_name: quote.client_name,
      client_email: quote.client_email,
      items: quote.items,
      total: quote.total,
      status: 'unpaid',
    }).select().single()

    if (error || !invoice) {
      toast.dismiss()
      return toast.error('Failed to convert quote')
    }

    const { error: updateError } = await supabase.from('quotes').update({
      status: 'converted',
      invoice_id: invoice.id,
      converted_at: new Date().toISOString(),
    }).eq('id', quote.id)

    if (updateError) {
      toast.dismiss()
      return toast.error('Failed to update quote')
    }

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
        const result = await res.text()
        if (!res.ok) throw new Error(result || 'Failed to send email')
        return 'Email sent!'
      }),
      {
        loading: 'Sending quote...',
        success: 'Email sent!',
        error: (err) => err.message || 'Error sending email',
      }
    ).finally(() => {
      console.log(`✅ Email send request triggered for quote ID: ${quoteId}`)
      router.refresh()
    })
  }

  if (loading) return <p className="p-10 text-center">Loading quotes...</p>

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
              <p><span className="font-medium">Reference:</span> {q.reference || 'N/A'}</p>
              <p><span className="font-medium">Client:</span> {q.client_name}</p>
              <p><span className="font-medium">Email:</span> {q.client_email}</p>
              <p><span className="font-medium">Total:</span> R {q.total?.toFixed(2)}</p>
              <p><span className="font-medium">Status:</span> {q.status}</p>
              <p><span className="font-medium">Created:</span> {new Date(q.created_at).toLocaleDateString()}</p>
              {q.status === 'converted' && (
                <p><span className="font-medium">Converted:</span> {q.converted_at ? new Date(q.converted_at).toLocaleDateString() : 'N/A'}</p>
              )}
              <div className="flex flex-wrap gap-2">
                <Link href={`/quote/edit-quote?id=${q.id}`} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                  Edit
                </Link>
                {q.status !== 'converted' && (
                  <button
                    onClick={() => convertToInvoice(q)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Convert
                  </button>
                )}
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
                {q.invoice_id && (
                  <Link href={`/invoice/view?id=${q.invoice_id}`} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                    View Invoice
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
