import { supabase } from '@/lib/supabaseClient'

export async function POST(req: Request) {
  try {
    const { path } = await req.json()

    if (!path) {
      return new Response(
        JSON.stringify({ error: 'Missing file path' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { data, error } = await supabase.storage
      .from('invoices')
      .createSignedUrl(path, 3600) // URL valid for 1 hour

    if (error || !data?.signedUrl) {
      return new Response(
        JSON.stringify({ error: error?.message || 'Failed to create signed URL' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ url: data.signedUrl }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
