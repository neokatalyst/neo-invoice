export function generateInvoiceHTML(invoice: any): string {
  const reference = invoice.reference || invoice.id
  const client = invoice.client_name || 'Customer'
  const total = (invoice.total ?? 0).toFixed(2)
  const status = invoice.status || 'unpaid'

  const items = Array.isArray(invoice.items)
    ? invoice.items
    : typeof invoice.items === 'string'
    ? JSON.parse(invoice.items)
    : []

  const logoUrl = invoice.logoUrl || 'https://raw.githubusercontent.com/neokatalyst/neo-assets/main/logo/neo-invoice-logo-dark.png'

  const itemsHtml = items.map(
    (item: any) => `
      <tr>
        <td>${item.description || ''}</td>
        <td>${item.quantity || 1}</td>
        <td>R ${(item.price || 0).toFixed(2)}</td>
        <td>R ${((item.quantity || 1) * (item.price || 0)).toFixed(2)}</td>
      </tr>`
  ).join('')

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Invoice ${reference}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #333;
            background: #fff;
            max-width: 800px;
            margin: auto;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
          }
          .logo {
            max-height: 60px;
          }
          h1 {
            background: #1d4ed8;
            color: white;
            padding: 12px;
            margin: 0 0 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: left;
          }
          th {
            background: #f0f0f0;
          }
          .summary {
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="${logoUrl}" class="logo" alt="Company Logo" />
          <div>
            <p><strong>Invoice Ref:</strong> ${reference}</p>
            <p><strong>Status:</strong> ${status}</p>
          </div>
        </div>

        <h1>Invoice</h1>
        <p><strong>Client:</strong> ${client}</p>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Line Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="summary">
          <h3>Total: R ${total}</h3>
        </div>
      </body>
    </html>
  `
}
