'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { InvoiceDetailProps } from '@/types/invoice_layout'

export default function InvoiceDetailTablet({
  invoice,
  onMarkAsPaid,
  onUpload,
  uploading,
}: InvoiceDetailProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-center">Invoice Details</h1>

      <div className="bg-white p-4 rounded shadow space-y-2 text-sm">
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

      <div className="flex flex-col gap-3">
        {invoice.status !== 'paid' && (
          <button onClick={onMarkAsPaid} className="bg-green-600 text-white px-4 py-2 rounded">
            Mark as Paid
          </button>
        )}
        <label className="bg-gray-700 text-white px-4 py-2 rounded text-center cursor-pointer">
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
