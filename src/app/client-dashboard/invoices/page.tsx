'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import Link from 'next/link'
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout'

type Invoice = {
  id: string
  reference: string | null
  client_name: string
  total: number
  status: string
  created_at: string
  paid_at?: string | null
}

export default function InvoiceListPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvoices = async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('id, reference, client_name, total, status, created_at, paid_at')
        .order('created_at', { ascending: false })

      if (error) toast.error(error.message)
      if (data) setInvoices(data as Invoice[])
      setLoading(false)
    }

    fetchInvoices()
  }, [])

  const totalInvoices = invoices.length
  const paidInvoices = invoices.filter(i => i.status === 'paid').length
  const unpaidInvoices = invoices.filter(i => i.status === 'unpaid').length
  const overdueInvoices = invoices.filter(i =>
    i.status === 'unpaid' &&
    new Date(i.created_at).getTime() < Date.now() - 30 * 24 * 60 * 60 * 1000
  ).length

  if (loading) return <p className="p-10 text-center">Loading invoices...</p>

  const content = (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Invoices" value={totalInvoices} />
        <StatCard label="Paid" value={paidInvoices} color="green" />
        <StatCard label="Unpaid" value={unpaidInvoices} color="yellow" />
        <StatCard label="Overdue" value={overdueInvoices} color="red" />
      </div>

      <h1 className="text-2xl font-bold mb-4">All Invoices</h1>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-200 rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Reference</th>
              <th className="p-3 text-left">Client</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left">Paid</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-t border-gray-100">
                <td className="p-3">{invoice.reference || invoice.id.slice(0, 8)}</td>
                <td className="p-3">{invoice.client_name}</td>
                <td className="p-3">R {invoice.total.toFixed(2)}</td>
                <td className="p-3 capitalize">{invoice.status}</td>
                <td className="p-3">{format(new Date(invoice.created_at), 'dd MMM yyyy')}</td>
                <td className="p-3">
                  {invoice.paid_at
                    ? format(new Date(invoice.paid_at), 'dd MMM yyyy')
                    : <span className="text-gray-400 italic">Not Paid</span>}
                </td>
                <td className="p-3 space-y-1 flex flex-col">
                  <Link href={`/client-dashboard/invoices/view/${invoice.id}`}>
                    <button className="text-blue-600 hover:underline">View</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return <ResponsiveLayout mobile={content} tablet={content} desktop={content} />
}

const StatCard = ({ label, value, color = 'gray' }: { label: string, value: number, color?: string }) => (
  <div className={`bg-${color}-100 p-4 rounded shadow text-center`}>
    <h2 className="text-lg font-bold">{label}</h2>
    <p className={`text-2xl text-${color}-700`}>{value}</p>
  </div>
)
