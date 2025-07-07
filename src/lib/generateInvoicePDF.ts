import * as Print from 'expo-print'
import * as FileSystem from 'expo-file-system'

export async function generateInvoicePDF(invoice: {
  client_name: string
  client_email: string
  amount: number
  created_at: string
}) {
  const html = `
    <html>
      <body style="font-family: Arial; padding: 24px;">
        <h1>Invoice</h1>
        <p><strong>Client:</strong> ${invoice.client_name}</p>
        <p><strong>Email:</strong> ${invoice.client_email}</p>
        <p><strong>Amount:</strong> R${invoice.amount}</p>
        <p><strong>Date:</strong> ${new Date(invoice.created_at).toLocaleDateString()}</p>
      </body>
    </html>
  `

  const { uri } = await Print.printToFileAsync({ html })

  // Copy PDF to app cache dir for upload
  const fileUri = `${FileSystem.cacheDirectory}invoice-${Date.now()}.pdf`
  await FileSystem.copyAsync({ from: uri, to: fileUri })

  return fileUri
}
