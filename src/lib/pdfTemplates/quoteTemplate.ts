export const generateQuoteHTML = (quote: any, logoUrl?: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Quote PDF</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: center; }
    .logo { max-height: 80px; }
    .items { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .items th, .items td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    .total { margin-top: 20px; font-size: 1.2rem; font-weight: bold; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Quote</h1>
    ${logoUrl ? `<img src="${logoUrl}" class="logo" />` : ''}
  </div>

  <p><strong>Client:</strong> ${quote.client_name}</p>
  <p><strong>Email:</strong> ${quote.client_email}</p>
  <p><strong>Date:</strong> ${new Date(quote.created_at).toLocaleDateString()}</p>

  <table class="items">
    <thead>
      <tr><th>Description</th><th>Quantity</th><th>Price</th></tr>
    </thead>
    <tbody>
      ${quote.items.map((item: any) => `
        <tr>
          <td>${item.description}</td>
          <td>${item.quantity}</td>
          <td>R ${item.price}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <p class="total">Total: R ${quote.total?.toFixed(2)}</p>
</body>
</html>
`;
