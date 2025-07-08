// src/lib/generateInvoicePdf.ts
import jsPDF from 'jspdf'

export interface Invoice {
  id?: string
  client_name: string
  client_email: string
  amount: number
  status: string
  created_at: string
}

export function generateInvoicePdf(invoice: Invoice) {
  const doc = new jsPDF()

  // Define margins
  const marginLeft = 15
  const marginTop = 20
  let y = marginTop

  // Header
  doc.setFontSize(18)
  doc.text('Invoice', marginLeft, y)
  y += 10

  if (invoice.id) {
    doc.setFontSize(10)
    doc.text(`Invoice ID: ${invoice.id}`, marginLeft, y)
    y += 10
  }

  // Invoice details
  doc.setFontSize(12)
  doc.text(`Client: ${invoice.client_name}`, marginLeft, y)
  y += 8
  doc.text(`Email: ${invoice.client_email}`, marginLeft, y)
  y += 8
  doc.text(`Amount: R${invoice.amount.toFixed(2)}`, marginLeft, y)
  y += 8
  doc.text(`Status: ${invoice.status}`, marginLeft, y)
  y += 8
  doc.text(`Date: ${new Date(invoice.created_at).toLocaleString()}`, marginLeft, y)

  return doc
}
