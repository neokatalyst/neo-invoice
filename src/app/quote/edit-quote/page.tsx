'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'

type Quote = {
  id: string
  client_name: string
  reference: string | null
  status: string
  total: number
  created_at: string
}

export default function EditQuote() {
  const params = useSearchParams()
  const quoteId = params.get('id')

  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuote = async () => {
      if (!quoteId) return

      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', quoteId)
        .single()

      if (error || !data) {
        toast.error('Quote not found')
        return
      }

      setQuote(data)
      setLoading(false)
    }

    fetchQuote()
  }, [quoteId])

  if (loading) return null
  if (!quote) return <p className="text-red-600 p-10 text-center">Quote not found.</p>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Edit Quote</h1>

      <div className="bg-white p-4 rounded shadow">
        <p><strong>Reference:</strong> {quote.reference || quote.id}</p>
        <p><strong>Client:</strong> {quote.client_name}</p>
        <p><strong>Status:</strong> {quote.status}</p>
        <p><strong>Total:</strong> R {quote.total.toFixed(2)}</p>
        <p><strong>Created:</strong> {new Date(quote.created_at).toLocaleDateString()}</p>
      </div>

      {/* Add form or editable fields below this as needed */}
    </div>
  )
}
