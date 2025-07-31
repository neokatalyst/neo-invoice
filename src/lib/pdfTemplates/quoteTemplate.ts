import { calculateVat, formatCurrency } from '@/lib/formatting';

export function generateQuoteHTML(
  quote: {
    client_name: string;
    client_email: string;
    reference?: string;
    items: {
      description: string;
      quantity: number;
      price: number;
    }[];
    total?: number;
    currency?: 'ZAR' | 'USD' | 'EUR' | 'GBP';
    vat_rate?: number;
    vat_inclusive?: boolean;
  },
  logoUrl?: string
): string {
  const escapeHtml = (text: string): string =>
    String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  const currency = quote.currency ?? 'ZAR';
  const vatRate = quote.vat_rate ?? 15;
  const vatInclusive = quote.vat_inclusive ?? true;

  // ✅ Defensive handling of numeric inputs
  const totalAmount = quote.items.reduce((acc, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    return acc + qty * price;
  }, 0);

  const { subtotal, vat, total } = calculateVat(totalAmount, vatRate, vatInclusive);

  const itemsHtml = quote.items
    .map(item => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      const lineTotal = qty * price;

      return `
        <tr>
          <td>${escapeHtml(item.description)}</td>
          <td>${qty}</td>
          <td>${formatCurrency(price, currency)}</td>
          <td>${formatCurrency(lineTotal, currency)}</td>
        </tr>
      `;
    })
    .join('');

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
        .total { text-align: right; font-size: 18px; font-weight: bold; line-height: 1.6; }
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
      <div class="total">
        <p>Subtotal: ${formatCurrency(subtotal, currency)}</p>
        <p>VAT (${vatRate}%): ${formatCurrency(vat, currency)}</p>
        <p>Total: ${formatCurrency(total, currency)}</p>
      </div>
    </body>
    </html>
  `;
}
