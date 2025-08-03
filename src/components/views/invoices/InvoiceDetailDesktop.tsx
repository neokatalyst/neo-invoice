'use client'

import Link from 'next/link'
import InvoiceActions from '@/components/InvoiceActions'
import { format } from 'date-fns'
import { InvoiceDetailProps } from '@/types/invoice_layout'

export default function InvoiceDetailDesktop({
  invoice,
  onMarkAsPaid,
  onUpload,
  uploading,
}: InvoiceDetailProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Invoice Detail</h1>

      <div className="bg-white p-4 rounded shadow space-y-2">
        <p><strong>Reference:</strong> {invoice.reference || invoice.id.slice(0, 8)}</p>
        <p><strong>Client:</strong> {invoice.client_name}</p>
        <p><strong>Total:</strong> R {invoice.total.toFixed(2)}</p>
        <p><strong>Status:</strong> {invoice.status}</p>
        <p><strong>Created:</strong> {format(new Date(invoice.created_at), 'dd MMM yyyy')}</p>
        {invoice.paid_at && (
          <p><strong>Paid:</strong> {format(new Date(invoice.paid_at), 'dd MMM yyyy')}</p>
        )}
        {invoice.proof_url && (
          <p>
            <strong>Proof:</strong>{' '}
            <a href={invoice.proof_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              View File
            </a>
          </p>
        )}
      </div>

      {invoice.items && invoice.items.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Line Items</h2>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-right">Qty</th>
                <th className="p-2 text-right">Unit Price</th>
                <th className="p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{item.description}</td>
                  <td className="p-2 text-right">{item.quantity}</td>
                  <td className="p-2 text-right">
  R {(typeof item.unit_price === 'number' ? item.unit_price : 0).toFixed(2)}
</td>
<td className="p-2 text-right">
  R {(item.quantity * (typeof item.unit_price === 'number' ? item.unit_price : 0)).toFixed(2)}
</td>

                  <td className="p-2 text-right">R {(item.quantity * item.unit_price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex gap-2 mt-6 flex-wrap">
        {invoice.status !== 'paid' && (
          <button onClick={onMarkAsPaid} className="bg-green-600 text-white px-4 py-2 rounded">
            Mark as Paid
          </button>
        )}
        <InvoiceActions invoice={invoice} />
        <label className="bg-gray-700 text-white px-4 py-2 rounded cursor-pointer">
          {uploading ? 'Uploading...' : 'Upload Proof of Payment'}
          <input
            type="file"
            onChange={onUpload}
            className="hidden"
            accept="image/*,.pdf"
            disabled={uploading}
          />
        </label>
        <Link href="/client-dashboard/invoices">
          <button className="bg-gray-600 text-white px-4 py-2 rounded">
            Return to Dashboard
          </button>
        </Link>
      </div>
    </div>
  )
}
