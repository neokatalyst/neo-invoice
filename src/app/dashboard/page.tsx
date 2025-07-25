'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuthRedirect } from '@/lib/useAuthRedirect'
import { generateInvoicePdf } from '@/lib/generateInvoicePDF'
import { generateAndUploadInvoicePdf } from '@/lib/uploadInvoicePdf'
import Header from '@/components/Header'
import toast from 'react-hot-toast'
import { FaDownload, FaUpload, FaEye } from 'react-icons/fa'

export default function DashboardPage() {
  useAuthRedirect() // Redirect if not authenticated

  const [invoices, setInvoices] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loadingInvoiceId, setLoadingInvoiceId] = useState<string | null>(null)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { data, error } = await supabase.from('invoices').select('*')
        if (error) throw error
        setInvoices(data || [])
      } catch (err: any) {
        console.error('Error fetching invoices:', err.message)
        setError(err.message)
        toast.error('Failed to fetch invoices')
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
          path: `invoices/invoice-${invoice.client_name
            .toLowerCase()
            .replace(/\s+/g, '_')}-${invoice.id}-${new Date(
            invoice.created_at
          ).getTime()}.pdf`,
        }),
      })

      const { url } = await res.json()
      if (url) {
        window.open(url, '_blank')
      } else {
        throw new Error('Signed URL not returned')
      }
    } catch (err) {
      console.error('Failed to open signed URL:', err)
      toast.error('Could not open invoice PDF')
    }
  }

  const handleSendEmail = async (invoice: any) => {
    try {
      // Generate signed URL for PDF
      const pdfPath = `invoices/invoice-${invoice.client_name
        .toLowerCase()
        .replace(/\s+/g, '_')}-${invoice.id}-${new Date(invoice.created_at).getTime()}.pdf`

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
    <div className="min-h-screen bg-gray-50 text-black">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Invoices Dashboard</h1>

        {/* Summary */}
        <div className="flex space-x-6 mb-8">
          <div className="bg-white rounded shadow p-4 flex-1 text-center">
            <h2 className="text-xl font-semibold">Total Invoices</h2>
            <p className="text-2xl">{totalInvoices}</p>
          </div>
          <div className="bg-white rounded shadow p-4 flex-1 text-center">
            <h2 className="text-xl font-semibold text-green-600">Paid</h2>
            <p className="text-2xl">{paidInvoices}</p>
          </div>
          <div className="bg-white rounded shadow p-4 flex-1 text-center">
            <h2 className="text-xl font-semibold text-red-600">Unpaid</h2>
            <p className="text-2xl">{unpaidInvoices}</p>
          </div>
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

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDownload(invoice)}
                    className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    title="Download PDF"
                  >
                    <FaDownload className="mr-2" /> Download
                  </button>

                  <button
                    onClick={() => handleUpload(invoice)}
                    disabled={loadingInvoiceId === invoice.id}
                    className={`flex items-center px-3 py-1 rounded text-white ${
                      loadingInvoiceId === invoice.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                    }`}
                    title="Upload PDF to Supabase"
                  >
                    <FaUpload className="mr-2" />
                    {loadingInvoiceId === invoice.id ? 'Uploading...' : 'Upload'}
                  </button>

                  <button
                    onClick={() => handleSendEmail(invoice)}
                    className="flex items-center px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                    title="Send Invoice Email"
                  >
                    📧 Send Email
                  </button>

                  {invoice.pdf_url && (
                    <button
                      onClick={() => handleView(invoice)}
                      className="flex items-center px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-800"
                      title="View PDF"
                    >
                      <FaEye className="mr-2" /> View
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
