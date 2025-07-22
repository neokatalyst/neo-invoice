export function generateInvoiceHTML({
  company_logo_url,
  company_name,
  company_address,
  client_name,
  client_email,
  invoice_reference,
  invoice_date,
  due_date,
  items,
  subtotal,
  vat,
  total,
  notes
}: {
  company_logo_url: string;
  company_name: string;
  company_address: string;
  client_name: string;
  client_email: string;
  invoice_reference: string;
  invoice_date: string;
  due_date: string;
  items: { description: string; quantity: number; price: string; total: string; }[];
  subtotal: string;
  vat: string;
  total: string;
  notes: string;
}): string {
  const itemsHtml = items.map(item => `
    <tr>
      <td>${item.description}</td>
      <td style="text-align:center">${item.quantity}</td>
      <td style="text-align:right">R ${item.price}</td>
      <td style="text-align:right">R ${item.total}</td>
    </tr>
  `).join('');

  return `
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 40px; background: #fff; color: #333; }
        .header { display: flex; align-items: center; justify-content: space-between; }
        .invoice-title { font-size: 32px; font-weight: bold; }
        .company-info, .client-info { margin-top: 20px; line-height: 1.5; }
        table { width: 100%; border-collapse: collapse; margin-top: 30px; }
        td, th { border: 1px solid #eee; padding: 12px; }
        th { background: #f7f7f7; text-align: left; }
        .totals { margin-top: 30px; text-align: right; line-height: 1.8; }
        .notes { margin-top: 40px; font-size: 14px; color: #555; }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="${company_logo_url}" alt="Logo" height="60" />
        <div class="invoice-title">Invoice</div>
      </div>
      <div class="company-info">
        <strong>${company_name}</strong><br />${company_address}
      </div>
      <div class="client-info">
        <strong>Bill To:</strong><br />${client_name}<br />${client_email}
      </div>
      <div class="invoice-details">
        <p>
          <strong>Invoice #:</strong> ${invoice_reference}<br />
          <strong>Date:</strong> ${invoice_date}<br />
          <strong>Due Date:</strong> ${due_date}
        </p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th style="text-align:center">Qty</th>
            <th style="text-align:right">Unit Price</th>
            <th style="text-align:right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      <div class="totals">
        <p>Subtotal: R ${subtotal}</p>
        <p>VAT: R ${vat}</p>
        <p><strong>Total: R ${total}</strong></p>
      </div>
      <div class="notes">
        <strong>Notes:</strong><br />${notes}
      </div>
    </body>
  </html>`;
}


