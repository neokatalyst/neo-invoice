import type { Quote, LineItem } from './types'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function generateQuoteHTML(quote: Quote, logoUrl?: string): string {
  const items = Array.isArray(quote.items) ? quote.items : []
  const total = quote.total ?? 0

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Quote ${escapeHtml(quote.reference || '')}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          color: #333;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }
        .logo {
          max-height: 80px;
        }
        .section {
          margin-bottom: 30px;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .table th, .table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        .table th {
          background-color: #f5f5f5;
        }
        .total {
          text-align: right;
          font-size: 18px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>

      <div class="header">
        <h1>Quote</h1>
        ${logoUrl ? `<img src="${logoUrl}" class="logo" alt="Logo" />` : ''}
      </div>

      <div class="section">
        <p><strong>Client Name:</strong> ${escapeHtml(quote.client_name)}</p>
        <p><strong>Client Email:</strong> ${escapeHtml(quote.client_email)}</p>
        <p><strong>Reference:</strong> ${escapeHtml(quote.reference || '')}</p>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((item: LineItem) => `
            <tr>
              <td>${escapeHtml(item.description)}</td>
              <td>${item.quantity}</td>
              <td>R ${item.price.toFixed(2)}</td>
              <td>R ${(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="total">
        Total: R ${total.toFixed(2)}
      </div>

    </body>
    </html>
  `
}
