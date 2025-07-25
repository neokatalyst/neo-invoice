type InvoiceItem = {
  description: string
  quantity: number
  price: string
  total: string
}

type InvoiceData = {
  company_logo_url: string
  company_name: string
  company_address: string
  client_name: string
  client_email: string
  invoice_reference: string
  invoice_date: string
  due_date: string
  items: InvoiceItem[]
  subtotal: string
  vat: string
  total: string
  notes: string
}

export function generateInvoiceHTML(invoice: InvoiceData): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Invoice ${invoice.invoice_reference}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 40px;
          color: #333;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          max-height: 80px;
        }
        .section {
          margin-top: 40px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #f4f4f4;
        }
        .totals {
          margin-top: 20px;
          text-align: right;
        }
        .notes {
          margin-top: 40px;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1>Invoice</h1>
          <p><strong>Ref:</strong> ${invoice.invoice_reference}</p>
          <p><strong>Date:</strong> ${invoice.invoice_date}</p>
          <p><strong>Due:</strong> ${invoice.due_date}</p>
        </div>
        ${invoice.company_logo_url
          ? `<img src="${invoice.company_logo_url}" class="logo" alt="Logo" />`
          : ''}
      </div>

      <div class="section">
        <h2>${invoice.company_name}</h2>
        <p>${invoice.company_address}</p>
      </div>

      <div class="section">
        <h3>Bill To:</h3>
        <p><strong>${invoice.client_name}</strong></p>
        <p>${invoice.client_email}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items
            .map(
              (item) => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>R ${item.price}</td>
                <td>R ${item.total}</td>
              </tr>
            `
            )
            .join('')}
        </tbody>
      </table>

      <div class="totals">
        <p><strong>Subtotal:</strong> R ${invoice.subtotal}</p>
        <p><strong>VAT (15%):</strong> R ${invoice.vat}</p>
        <p><strong>Total:</strong> R ${invoice.total}</p>
      </div>

      <div class="notes">
        <strong>Notes:</strong>
        <p>${invoice.notes || 'Thank you for your business!'}</p>
      </div>
    </body>
    </html>
  `
}
