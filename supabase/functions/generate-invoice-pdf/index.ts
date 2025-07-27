import { serve } from 'https://deno.land/std@0.192.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1'

const supabase = createClient(
  Deno.env.get('PRIVATE_SUPABASE_URL')!,
  Deno.env.get('PRIVATE_SUPABASE_SERVICE_ROLE_KEY')!
)

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('OK', {
      status: 200,
      headers: corsHeaders(),
    })
  }

  const { searchParams } = new URL(req.url)
  const invoice_id = searchParams.get('invoice_id')

  if (!invoice_id) {
    return new Response('Missing invoice_id', {
      status: 400,
      headers: corsHeaders(),
    })
  }

  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', invoice_id)
    .single()

  if (error || !invoice) {
    console.error('❌ Invoice fetch failed:', error?.message)
    return new Response('Invoice not found', {
      status: 404,
      headers: corsHeaders(),
    })
  }

  const pdfContent = `Invoice PDF for ${invoice.reference ?? invoice.id}`
  const pdfBlob = new Blob([pdfContent], { type: 'application/pdf' })

  return new Response(pdfBlob, {
    status: 200,
    headers: {
      ...corsHeaders(),
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="invoice-${invoice.reference ?? invoice.id}.pdf"`,
    },
  })
})

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}
