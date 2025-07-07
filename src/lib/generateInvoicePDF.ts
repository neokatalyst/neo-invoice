// lib/generateInvoicePdf.ts
import jsPDF from 'jspdf'

export function generateInvoicePdf(invoice: {
  client_name: string
  client_email: string
  amount: number
  status: string
  created_at: string
}) {
  const doc = new jsPDF()

  doc.setFontSize(16)
  doc.text('Invoice', 10, 20)

  doc.setFontSize(12)
  doc.text(`Client: ${invoice.client_name}`, 10, 40)
  doc.text(`Email: ${invoice.client_email}`, 10, 50)
  doc.text(`Amount: R${invoice.amount}`, 10, 60)
  doc.text(`Status: ${invoice.status}`, 10, 70)
  doc.text(`Date: ${new Date(invoice.created_at).toLocaleString()}`, 10, 80)

  return doc
}

