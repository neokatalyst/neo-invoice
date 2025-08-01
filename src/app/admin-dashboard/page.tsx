'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout'

export default function AdminDashboardHome() {
  const [clientCount, setClientCount] = useState<number>(0)
  const [invoiceCount, setInvoiceCount] = useState<number>(0)
  const [quoteCount, setQuoteCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdminStats = async () => {
      setLoading(true)

      const { count: clients, error: clientError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      const { count: invoices, error: invoiceError } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })

      const { count: quotes, error: quoteError } = await supabase
        .from('quotes')
        .select('*', { count: 'exact', head: true })

      if (clientError) toast.error('Failed to load clients')
      if (invoiceError) toast.error('Failed to load invoices')
      if (quoteError) toast.error('Failed to load quotes')

      setClientCount(clients || 0)
      setInvoiceCount(invoices || 0)
      setQuoteCount(quotes || 0)

      setLoading(false)
    }

    fetchAdminStats()
  }, [])

  if (loading) {
    const loadingContent = <p className="p-4">Loading admin stats...</p>
    return <ResponsiveLayout mobile={loadingContent} tablet={loadingContent} desktop={loadingContent} />
  }

  const content = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <AdminStatCard title="Total Clients" count={clientCount} />
      <AdminStatCard title="Total Invoices" count={invoiceCount} />
      <AdminStatCard title="Total Quotes" count={quoteCount} />
    </div>
  )

  return <ResponsiveLayout mobile={content} tablet={content} desktop={content} />
}

const AdminStatCard = ({ title, count }: { title: string; count: number }) => (
  <div className="bg-white rounded shadow p-6 text-center hover:shadow-lg transition">
    <h2 className="text-lg font-medium">{title}</h2>
    <p className="text-4xl font-bold mt-2">{count}</p>
  </div>
)
