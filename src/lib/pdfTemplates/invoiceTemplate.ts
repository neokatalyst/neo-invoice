import { Invoice } from '@/app/invoice/list/page'

export function generateInvoiceHTML(invoice: Invoice): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Invoice ${invoice.reference || ''}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; }
        .title { font-size: 32px; font-weight: bold; }
        .client { margin-bottom: 30px; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .table th { background-color: #f5f5f5; }
        .total { text-align: right; font-size: 20px; font-weight: bold; }
      </style>
    </head>
    <body>

      <div class="header">
        <div class="title">Invoice</div>
      </div>

      <div class="client">
        <p><strong>Client Name:</strong> ${invoice.client_name}</p>
        <p><strong>Client Email:</strong> ${invoice.client_email}</p>
        <p><strong>Reference:</strong> ${invoice.reference || ''}</p>
      </div>

      <div class="total">
        Total: R ${invoice.total?.toFixed(2)}
      </div>

    </body>
    </html>
  `;
}
