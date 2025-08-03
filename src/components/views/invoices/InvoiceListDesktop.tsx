'use client'

import { format } from 'date-fns'
import Link from 'next/link'

export type Invoice = {
  id: string
  reference: string | null
  client_name: string
  total: number
  status: string
  created_at: string
  paid_at?: string | null
}

export default function InvoiceListDesktop({ invoices }: { invoices: Invoice[] }) {
  const total = invoices.length
  const paid = invoices.filter(i => i.status === 'paid').length
  const unpaid = invoices.filter(i => i.status === 'unpaid').length
  const overdue = invoices.filter(i =>
    i.status === 'unpaid' &&
    new Date(i.created_at).getTime() < Date.now() - 30 * 24 * 60 * 60 * 1000
  ).length

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Link href="/client-dashboard">
          <button className="bg-gray-800 text-white px-4 py-2 rounded">← Dashboard</button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Invoices" value={total} />
        <StatCard label="Paid" value={paid} color="green" />
        <StatCard label="Unpaid" value={unpaid} color="yellow" />
        <StatCard label="Overdue" value={overdue} color="red" />
      </div>

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
  )
}

function StatCard({ label, value, color = 'gray' }: { label: string, value: number, color?: string }) {
  return (
    <div className={`bg-${color}-100 p-4 rounded shadow text-center`}>
      <h2 className="text-lg font-bold">{label}</h2>
      <p className={`text-2xl text-${color}-700`}>{value}</p>
    </div>
  )
}
