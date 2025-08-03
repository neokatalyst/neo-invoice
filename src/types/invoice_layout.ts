export type Invoice = {
  id: string
  reference: string | null
  client_name: string
  total: number
  status: string
  created_at: string
  paid_at?: string | null
  items?: {
    description: string
    quantity: number
    unit_price: number
  }[]
  proof_url?: string | null
}

export type InvoiceDetailProps = {
  invoice: Invoice
  onMarkAsPaid: () => void
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  uploading: boolean
}
