export const generateQuoteHTML = (quote: any, logoUrl?: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Quote ${quote.reference}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: center; }
    .logo { max-height: 80px; }
    .items { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .items th, .items td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    .total { margin-top: 20px; font-size: 1.2rem; font-weight: bold; }
    .footer { margin-top: 40px; font-size: 0.9rem; color: #555; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>Quote: ${quote.reference ?? 'N/A'}</h1>
      <p><strong>Date:</strong> ${new Date(quote.created_at).toLocaleDateString()}</p>
    </div>
    ${logoUrl ? `<img src="${logoUrl}" class="logo" />` : ''}
  </div>

  <p><strong>Client:</strong> ${quote.client_name}</p>
  <p><strong>Email:</strong> ${quote.client_email}</p>

  <table class="items">
    <thead>
      <tr><th>Description</th><th>Quantity</th><th>Price (R)</th><th>Total (R)</th></tr>
    </thead>
    <tbody>
      ${quote.items.map((item: any) => `
        <tr>
          <td>${item.description}</td>
          <td>${item.quantity}</td>
          <td>${item.price.toFixed(2)}</td>
          <td>${(item.quantity * item.price).toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <p class="total">Total Amount: R ${quote.total?.toFixed(2) ?? '0.00'}</p>

  <div class="footer">
    <p>Thank you for considering this quote.</p>
    <p>All amounts are in ZAR (R).</p>
  </div>
</body>
</html>
`;
