'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { format } from 'date-fns'

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
    new Date(i.created_at).getTime() < Date.now() - 30 * 24 * 60 * 60 * 1000 // 30+ days
  ).length

  if (loading) return <p className="p-10 text-center">Loading invoices...</p>

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow text-center">
            <h2 className="text-lg font-bold">Total Invoices</h2>
            <p className="text-2xl">{totalInvoices}</p>
          </div>
          <div className="bg-green-100 p-4 rounded shadow text-center">
            <h2 className="text-lg font-bold">Paid</h2>
            <p className="text-2xl text-green-700">{paidInvoices}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded shadow text-center">
            <h2 className="text-lg font-bold">Unpaid</h2>
            <p className="text-2xl text-yellow-700">{unpaidInvoices}</p>
          </div>
          <div className="bg-red-100 p-4 rounded shadow text-center">
            <h2 className="text-lg font-bold">Overdue</h2>
            <p className="text-2xl text-red-700">{overdueInvoices}</p>
          </div>
        </div>

        {/* Table Section */}
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
                  <td className="p-3">
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
    </div>
  )
}
