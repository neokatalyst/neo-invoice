'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function Page() {
  const [invoiceCount, setInvoiceCount] = useState<number>(0)
  const [quoteCount, setQuoteCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return toast.error('No user found')

      const { count: invoices, error: invoiceError } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      const { count: quotes, error: quoteError } = await supabase
        .from('quotes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      if (invoiceError) toast.error('Failed to load invoices')
      if (quoteError) toast.error('Failed to load quotes')

      setInvoiceCount(invoices || 0)
      setQuoteCount(quotes || 0)
      setLoading(false)
    }

    fetchStats()
  }, [])

  if (loading) return <p className="p-4">Loading stats...</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Link href="/client-dashboard/invoices" className="hover:opacity-80 transition">
        <StatCard title="Total Invoices" count={invoiceCount} />
      </Link>
      <Link href="/client-dashboard/quotes" className="hover:opacity-80 transition">
        <StatCard title="Total Quotes" count={quoteCount} />
      </Link>
    </div>
  )
}

const StatCard = ({ title, count }: { title: string; count: number }) => (
  <div className="bg-white rounded shadow p-6 text-center hover:shadow-lg transition">
    <h2 className="text-lg font-medium">{title}</h2>
    <p className="text-4xl font-bold mt-2">{count}</p>
  </div>
)
