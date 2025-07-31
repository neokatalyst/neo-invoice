export function generateQuoteHTML(
  quote: {
    client_name: string
    client_email: string
    reference?: string
    items: {
      description: string
      quantity: number
      price: number
    }[]
    total?: number
  },
  logoUrl?: string
): string {
  const escapeHtml = (text: string): string =>
    String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')

  const itemsHtml = quote.items
    .map((item: { description: string; quantity: number; price: number }) => `
      <tr>
        <td>${escapeHtml(item.description)}</td>
        <td>${item.quantity}</td>
        <td>R ${item.price.toFixed(2)}</td>
        <td>R ${(item.quantity * item.price).toFixed(2)}</td>
      </tr>
    `).join('')

  const total = quote.total ?? 0

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .logo { max-height: 80px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f5f5f5; }
        .total { text-align: right; font-size: 18px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Quote</h1>
        ${logoUrl ? `<img src="${logoUrl}" class="logo" alt="Logo" />` : ''}
      </div>
      <p><strong>Client Name:</strong> ${escapeHtml(quote.client_name)}</p>
      <p><strong>Client Email:</strong> ${escapeHtml(quote.client_email)}</p>
      <p><strong>Reference:</strong> ${escapeHtml(quote.reference ?? '')}</p>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      <div class="total">Total: R ${total.toFixed(2)}</div>
    </body>
    </html>
  `
}
