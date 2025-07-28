import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateInvoiceHTML } from '@/lib/pdfTemplates/invoiceTemplate'

// ✅ Admin Supabase client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const invoice_id = searchParams.get('invoice_id')

  if (!invoice_id) {
    return new Response('Missing invoice_id', { status: 400 })
  }

  const { data: invoice, error } = await supabaseAdmin
    .from('invoices')
    .select('*')
    .eq('id', invoice_id)
    .single()

  if (error || !invoice) {
    return new Response('Invoice not found', { status: 404 })
  }

  const html = await generateInvoiceHTML(invoice)

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}
