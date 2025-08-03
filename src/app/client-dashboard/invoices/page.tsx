'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout'
import InvoiceListDesktop from '@/components/views/invoices/InvoiceListDesktop'
import InvoiceListTablet from '@/components/views/invoices/InvoiceListTablet'
import InvoiceListMobile from '@/components/views/invoices/InvoiceListMobile'
import { Invoice } from '@/types/invoice_layout'

export default function InvoiceListPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvoices = async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('id, reference, client_name, total, status, created_at, paid_at, proof_url')
        .order('created_at', { ascending: false })

      if (error) toast.error(error.message)
      if (data) setInvoices(data)
      setLoading(false)
    }

    fetchInvoices()
  }, [])

  if (loading) return <p className="p-10 text-center">Loading invoices...</p>

  return (
    <ResponsiveLayout
      desktop={<InvoiceListDesktop invoices={invoices} />}
      tablet={<InvoiceListTablet invoices={invoices} />}
      mobile={<InvoiceListMobile invoices={invoices} />}
    />
  )
}
