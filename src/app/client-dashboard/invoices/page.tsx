'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'
import { FaDownload, FaUpload, FaEye } from 'react-icons/fa'

export default function ClientInvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loadingInvoiceId, setLoadingInvoiceId] = useState<string | null>(null)

  useEffect(() => {
    const fetchInvoices = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return toast.error('Please log in')

      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)

      if (error) {
        console.error('Error fetching invoices:', error.message)
        setError(error.message)
        toast.error('Failed to fetch invoices')
      } else {
        setInvoices(data || [])
      }
    }

    fetchInvoices()
  }, [])

  const totalInvoices = invoices.length
  const paidInvoices = invoices.filter(i => i.status === 'paid').length
  const unpaidInvoices = invoices.filter(i => i.status === 'unpaid').length

  const handleDownload = (invoice: any) => {
    const doc = generateInvoicePdf(invoice)
    doc.save(`invoice-${invoice.id}.pdf`)
  }

  const handleUpload = async (invoice: any) => {
    setLoadingInvoiceId(invoice.id)
    try {
      await generateAndUploadInvoicePdf(invoice)
      toast.success('PDF uploaded successfully!')
    } catch (err) {
      console.error('Upload failed:', err)
      toast.error('Error uploading PDF')
    } finally {
      setLoadingInvoiceId(null)
    }
  }

  const handleView = async (invoice: any) => {
    try {
      const res = await fetch('/api/getSignedUrl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `invoices/invoice-${invoice.client_name.toLowerCase().replace(/\s+/g, '_')}-${invoice.id}-${new Date(invoice.created_at).getTime()}.pdf`,
        }),
      })
      const { url } = await res.json()
      if (url) {
        window.open(url, '_blank')
      } else {
        throw new Error('Signed URL not returned')
      }
    } catch (err) {
      console.error('View error:', err)
      toast.error('Could not open invoice PDF')
    }
  }

  const handleSendEmail = async (invoice: any) => {
    try {
      const pdfPath = `invoices/invoice-${invoice.client_name.toLowerCase().replace(/\s+/g, '_')}-${invoice.id}-${new Date(invoice.created_at).getTime()}.pdf`

      const resSigned = await fetch('/api/getSignedUrl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: pdfPath }),
      })

      const { url: pdfUrl } = await resSigned.json()
      if (!pdfUrl) throw new Error('PDF URL not found')

      const htmlContent = `
        <p>Dear ${invoice.client_name},</p>
        <p>Please find your invoice for <strong>R${invoice.amount}</strong> at the link below:</p>
        <p><a href="${pdfUrl}" target="_blank" style="color: blue;">View Invoice</a></p>
        <p>Thank you,<br/>${invoice.company_name || 'Neo-Invoice'}</p>
      `

      const res = await fetch('/api/sendInvoiceEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: invoice.client_email,
          subject: `Invoice from ${invoice.company_name || 'Neo-Invoice'}`,
          html: htmlContent,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      toast.success('Invoice email sent!')
    } catch (err) {
      console.error('Email error:', err)
      toast.error('Failed to send invoice email')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Invoices</h1>

      {/* Summary */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 mb-8">
        <SummaryCard title="Total Invoices" count={totalInvoices} />
        <SummaryCard title="Paid" count={paidInvoices} color="text-green-600" />
        <SummaryCard title="Unpaid" count={unpaidInvoices} color="text-red-600" />
      </div>

      {/* Invoice List */}
      {error ? (
        <p className="text-red-600 mb-4">{error}</p>
      ) : invoices.length === 0 ? (
        <p className="text-gray-600">No invoices found.</p>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div className="mb-4 md:mb-0">
                <p><strong>Client:</strong> {invoice.client_name}</p>
                <p><strong>Email:</strong> {invoice.client_email}</p>
                <p><strong>Amount:</strong> R{invoice.amount}</p>
                <p><strong>Status:</strong> {invoice.status}</p>
                <p><strong>Created:</strong> {new Date(invoice.created_at).toLocaleString()}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={() => handleDownload(invoice)} color="bg-blue-600" icon={<FaDownload />}>Download</Button>
                <Button onClick={() => handleUpload(invoice)} color="bg-green-600" loading={loadingInvoiceId === invoice.id}>
                  {loadingInvoiceId === invoice.id ? 'Uploading…' : <> <FaUpload /> Upload</>}
                </Button>
                <Button onClick={() => handleSendEmail(invoice)} color="bg-purple-600">📧 Send Email</Button>
                {invoice.pdf_url && (
                  <Button onClick={() => handleView(invoice)} color="bg-gray-700"><FaEye /> View</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const SummaryCard = ({ title, count, color = '' }: { title: string; count: number; color?: string }) => (
  <div className={`bg-white rounded shadow p-4 flex-1 text-center ${color}`}>
    <h2 className="text-xl font-semibold">{title}</h2>
    <p className="text-2xl">{count}</p>
  </div>
)

const Button = ({ onClick, children, color, loading = false }: { onClick: () => void; children: React.ReactNode; color: string; loading?: boolean }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className={`flex items-center gap-2 px-3 py-1 rounded text-white ${color} hover:opacity-90 disabled:opacity-50`}
  >
    {children}
  </button>
)
