// supabase/functions/generate-invoice-pdf/template.ts
export function generateInvoiceHTML(invoice: any): string {
  const reference = invoice.reference || invoice.id
  const client = invoice.client_name || 'Customer'
  const total = (invoice.total ?? 0).toFixed(2)

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice ${reference}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { background: #1d4ed8; color: white; padding: 10px; }
          table { width: 100%; margin-top: 20px; border-collapse: collapse; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        </style>
      </head>
      <body>
        <h1>Invoice: ${reference}</h1>
        <p><strong>Client:</strong> ${client}</p>
        <p><strong>Total:</strong> R ${total}</p>
        <p><strong>Status:</strong> ${invoice.status}</p>
      </body>
    </html>
  `
}