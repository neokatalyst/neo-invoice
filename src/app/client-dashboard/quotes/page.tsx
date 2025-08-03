'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout'
import QuoteListDesktop from '@/components/views/quotes/QuoteListDesktop'
import QuoteListTablet from '@/components/views/quotes/QuoteListTablet'
import QuoteListMobile from '@/components/views/quotes/QuoteListMobile'
import { Quote } from '@/types/quote'

export default function QuoteListPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuotes = async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select('id, reference, client_name, client_email, total, status, created_at, converted_at, invoice_id')
        .order('created_at', { ascending: false })

      if (error) toast.error(error.message)
      if (data) setQuotes(data as Quote[])
      setLoading(false)
    }

    fetchQuotes()
  }, [])

  if (loading) {
    return <p className="p-10 text-center">Loading quotes...</p>
  }

  return (
    <ResponsiveLayout
      desktop={<QuoteListDesktop quotes={quotes} />}
      tablet={<QuoteListTablet quotes={quotes} />}
      mobile={<QuoteListMobile quotes={quotes} />}
    />
  )
}
