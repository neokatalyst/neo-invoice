"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { previewQuoteFromFunction } from '@/lib/previewQuoteFromFunction'
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout'

type Quote = {
  id: string
  reference: string | null
  client_name: string
  total: number
  status: string
  created_at: string
  converted_at?: string | null
  invoice_id?: string | null
}

export default function QuoteDetailPage() {
  const { id } = useParams()
  const router = useRouter()

  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuote = async () => {
      if (!id || typeof id !== 'string') return

      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        toast.error('Quote not found')
        return
      }

      setQuote(data)
      setLoading(false)
    }

    fetchQuote()
  }, [id])

  const convertToInvoice = async () => {
    if (!quote) return
    toast.loading('Converting...')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return toast.error('Not signed in')

    const { data: invoice, error } = await supabase.from('invoices').insert({
      user_id: user.id,
      quote_id: quote.id,
      client_name: quote.client_name,
      items: [],
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

  const viewPdf = async () => {
    if (!quote) return
    await previewQuoteFromFunction(quote.id)
  }

  const sendEmail = async () => {
    if (!quote) return

    toast.promise(
      fetch('/api/sendQuoteEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quote_id: quote.id }),
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

  if (loading) return <p className="p-10 text-center">Loading quote...</p>
  if (!quote) return <p className="p-10 text-center text-red-600">Quote not found</p>

  const content = (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Quote Detail</h1>

      <div className="bg-white p-4 rounded shadow space-y-2">
        <p><strong>Reference:</strong> {quote.reference || quote.id}</p>
        <p><strong>Client:</strong> {quote.client_name}</p>
        <p><strong>Total:</strong> R {quote.total?.toFixed(2)}</p>
        <p><strong>Status:</strong> {quote.status}</p>
        <p><strong>Created:</strong> {new Date(quote.created_at).toLocaleDateString()}</p>
        {quote.converted_at && (
          <p><strong>Converted:</strong> {new Date(quote.converted_at).toLocaleDateString()}</p>
        )}
      </div>

      <div className="flex gap-2 mt-6 flex-wrap">
        {quote.status !== 'converted' && (
          <button onClick={convertToInvoice} className="bg-green-600 text-white px-4 py-2 rounded">
            Convert to Invoice
          </button>
        )}
        <button onClick={viewPdf} className="bg-blue-600 text-white px-4 py-2 rounded">
          View PDF
        </button>
        <button onClick={sendEmail} className="bg-gray-800 text-white px-4 py-2 rounded">
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

  return <ResponsiveLayout mobile={content} tablet={content} desktop={content} />
}
