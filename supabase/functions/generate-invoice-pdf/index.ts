import { serve } from 'https://deno.land/std@0.192.0/http/server.ts'

serve(async (req: Request) => {
  // ✅ Handle preflight requests
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

  // ✅ Replace with real PDF logic
  const pdfContent = `Invoice PDF for ${invoice_id}`
  const pdfBlob = new Blob([pdfContent], { type: 'application/pdf' })

  return new Response(pdfBlob, {
    status: 200,
    headers: {
      ...corsHeaders(),
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="invoice-${invoice_id}.pdf"`,
    },
  })
})

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*', // Change to frontend URL if needed
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}
