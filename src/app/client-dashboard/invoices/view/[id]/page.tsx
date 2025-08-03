'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout'
import InvoiceDetailDesktop from '@/components/views/invoices/InvoiceDetailDesktop'
import InvoiceDetailTablet from '@/components/views/invoices/InvoiceDetailTablet'
import InvoiceDetailMobile from '@/components/views/invoices/InvoiceDetailMobile'
import { Invoice } from '@/types/invoice_layout'

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

  const onMarkAsPaid = async () => {
    if (!invoice) return

    const { error } = await supabase
      .from('invoices')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('id', invoice.id)

    if (error) return toast.error('Failed to mark as paid')
    toast.success('Invoice marked as paid')
    router.refresh()
  }

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <ResponsiveLayout
      desktop={
        <InvoiceDetailDesktop
          invoice={invoice}
          onMarkAsPaid={onMarkAsPaid}
          onUpload={onUpload}
          uploading={uploading}
        />
      }
      tablet={
        <InvoiceDetailTablet
          invoice={invoice}
          onMarkAsPaid={onMarkAsPaid}
          onUpload={onUpload}
          uploading={uploading}
        />
      }
      mobile={
        <InvoiceDetailMobile
          invoice={invoice}
          onMarkAsPaid={onMarkAsPaid}
          onUpload={onUpload}
          uploading={uploading}
        />
      }
    />
  )
}
