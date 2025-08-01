'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import InvoiceActions from '@/components/InvoiceActions'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import Link from 'next/link'
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout'

type LineItem = {
  description: string
  quantity: number
  unit_price: number
}

type Invoice = {
  id: string
  reference: string | null
  client_name: string
  total: number
  status: string
  created_at: string
  paid_at?: string | null
  items?: LineItem[]
  proof_url?: string | null
}

export default function InvoiceDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id || typeof id !== 'string') return

      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        toast.error('Invoice not found')
        return
      }

      setInvoice(data)
      setLoading(false)
    }

    fetchInvoice()
  }, [id])

 

  const markAsPaid = async () => {
    if (!invoice) return

    const { error } = await supabase
      .from('invoices')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('id', invoice.id)

    if (error) return toast.error('Failed to mark as paid')
    toast.success('Invoice marked as paid')
    router.refresh()
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !invoice) return

    setUploading(true)

    const filePath = `payments/proof-${invoice.id}-${Date.now()}.${file.name.split('.').pop()}`
    const { error: uploadError } = await supabase.storage
      .from('payments')
      .upload(filePath, file)

    if (uploadError) {
      toast.error('Upload failed')
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from('payments')
      .getPublicUrl(filePath)

    const { error: updateError } = await supabase
      .from('invoices')
      .update({ proof_url: urlData.publicUrl })
      .eq('id', invoice.id)

    if (updateError) {
      toast.error('Failed to update proof URL')
    } else {
      toast.success('Proof uploaded')
      router.refresh()
    }

    setUploading(false)
  }

  if (loading) return <p className="p-10 text-center">Loading invoice...</p>
  if (!invoice) return <p className="p-10 text-center text-red-600">Invoice not found</p>

  const content = (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Invoice Detail</h1>

      <div className="bg-white p-4 rounded shadow space-y-2">
        <p><strong>Reference:</strong> {invoice.reference || invoice.id.slice(0, 8)}</p>
        <p><strong>Client:</strong> {invoice.client_name}</p>
        <p><strong>Total:</strong> R {invoice.total?.toFixed(2)}</p>
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
                    R {typeof item.unit_price === 'number' ? item.unit_price.toFixed(2) : '-'}
                  </td>
                  <td className="p-2 text-right">
                    R {typeof item.unit_price === 'number'
                      ? (item.quantity * item.unit_price).toFixed(2)
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex gap-2 mt-6 flex-wrap">
        {invoice.status !== 'paid' && (
          <button onClick={markAsPaid} className="bg-green-600 text-white px-4 py-2 rounded">
            Mark as Paid
          </button>
        )}
        <InvoiceActions invoice={invoice} />
        <label className="bg-gray-700 text-white px-4 py-2 rounded cursor-pointer">
          {uploading ? 'Uploading...' : 'Upload Proof of Payment'}
          <input
            type="file"
            onChange={handleFileUpload}
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

  return <ResponsiveLayout mobile={content} tablet={content} desktop={content} />
}
