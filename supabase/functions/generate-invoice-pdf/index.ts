import { serve } from 'https://deno.land/std@0.192.0/http/server.ts'

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
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

  // Example dummy return — replace with your real PDF logic
  const pdfContent = `Invoice PDF for ${invoice_id}`
  return new Response(pdfContent, {
    status: 200,
    headers: {
      ...corsHeaders(),
      'Content-Type': 'application/pdf',
    },
  })
})

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*', // or restrict to your domain
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}
