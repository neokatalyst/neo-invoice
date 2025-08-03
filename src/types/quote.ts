export type Quote = {
  id: string
  reference: string | null
  client_name: string
  client_email: string
  total: number
  status: string
  created_at: string
  converted_at?: string | null
  invoice_id?: string | null
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Props = {
  quote: Quote
  onConvert: () => void
  onViewPdf: () => void
  onSendEmail: () => void
}

