'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { data, error } = await supabase.from('invoices').select('*')
        if (error) throw error
        setInvoices(data || [])
      } catch (err: any) {
        console.error('Error fetching invoices:', err.message)
        setError(err.message)
      }
    }

    fetchInvoices()
  }, [])

  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>Invoices</h1>
      <pre>{JSON.stringify(invoices, null, 2)}</pre>
    </div>
  )
}
