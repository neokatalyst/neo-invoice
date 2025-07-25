export type Invoice = {
  id: string
  client_name: string
  client_email: string
  total: number
  status: string
  created_at: string
  reference?: string | null
}
