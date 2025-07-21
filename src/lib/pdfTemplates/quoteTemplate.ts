import { Quote, LineItem } from './types'

export function generateQuoteHTML(quote: Quote, logoUrl?: string): string {
  console.log('✅ Starting HTML generation');
  console.log('Quote received:', JSON.stringify(quote, null, 2));
  console.log('Logo URL:', logoUrl);

  const items = Array.isArray(quote.items) ? quote.items : [];
  const total = quote.total || 0;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Quote ${quote.reference || ''}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; }
        .logo { max-height: 80px; }
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
        <div class="title">Quote</div>
        ${logoUrl ? `<img src="${logoUrl}" class="logo" />` : ''}
      </div>

      <div class="client">
        <p><strong>Client Name:</strong> ${quote.client_name}</p>
        <p><strong>Client Email:</strong> ${quote.client_email}</p>
        <p><strong>Reference:</strong> ${quote.reference || ''}</p>
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
              <td>${item.description}</td>
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
  `;
}
