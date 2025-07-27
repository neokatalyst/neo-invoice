// supabase/utils/generateQuoteHTML.ts

export function generateQuoteHTML(quote: any): string {
  const { client_name, total, created_at, items = [], reference } = quote

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Quote ${reference || quote.id}</title>
        <style>
          body { font-family: sans-serif; padding: 40px; }
          h1 { color: #1d4ed8; }
          table { width: 100%; margin-top: 20px; border-collapse: collapse; }
          th, td { border: 1px solid #ccc; padding: 8px; }
          th { background: #f9f9f9; }
        </style>
      </head>
      <body>
        <h1>Quote</h1>
        <p><strong>Client:</strong> ${client_name}</p>
        <p><strong>Date:</strong> ${new Date(created_at).toLocaleDateString()}</p>
        <p><strong>Total:</strong> R ${total.toFixed(2)}</p>

        ${
          items?.length
            ? `
          <table>
            <thead>
              <tr><th>Description</th><th>Qty</th><th>Price</th></tr>
            </thead>
            <tbody>
              ${items.map(
                (item: any) =>
                  `<tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>R ${item.price.toFixed(2)}</td>
                  </tr>`
              ).join('')}
            </tbody>
          </table>`
            : `<p><em>No line items provided.</em></p>`
        }
      </body>
    </html>
  `
}
