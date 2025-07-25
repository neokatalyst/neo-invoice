import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })

  const { data: { session }, error } = await supabase.auth.getSession()

  // If session can't be determined, let the layout handle it
  if (!session || error) {
    return response // Let the client-side layout handle redirects
  }

  const role = session.user.user_metadata.role
  const org = session.user.user_metadata.organisation_id

  if (request.nextUrl.pathname.startsWith('/admin-dashboard')) {
    if (role !== 'admin' && role !== 'superadmin') {
      return NextResponse.redirect(new URL('/client-dashboard', request.url))
    }
  }

  if (request.nextUrl.pathname.startsWith('/client-dashboard')) {
    if (!org) {
      return NextResponse.redirect(new URL('/admin-dashboard', request.url))
    }
  }

  return response
}
