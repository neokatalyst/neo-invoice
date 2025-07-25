export type InvoiceTemplateItem = {
  description: string
  quantity: number
  price: string
  total: string
}

export type InvoiceTemplateInput = {
  company_logo_url: string
  company_name: string
  company_address: string
  client_name: string
  client_email: string
  invoice_reference: string
  invoice_date: string
  due_date: string
  items: InvoiceTemplateItem[]
  subtotal: string
  vat: string
  total: string
  notes: string
}
