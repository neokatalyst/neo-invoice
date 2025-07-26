// supabase/functions/generate-invoice-pdf/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { generateInvoiceHTML } from './template.ts'

serve(async (req) => {
  const { searchParams } = new URL(req.url)
  const invoice_id = searchParams.get('invoice_id')

  if (!invoice_id) {
    return new Response('Missing invoice_id', { status: 400 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', invoice_id)
    .single()

  if (error || !invoice) {
    return new Response('Invoice not found', { status: 404 })
  }

  const html = generateInvoiceHTML(invoice)

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  })
})