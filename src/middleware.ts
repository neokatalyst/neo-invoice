import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })

  const { data: { session } } = await supabase.auth.getSession()

  // No session — redirect to root or login
  if (!session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const userRole = session.user.user_metadata.role
  const organisationId = session.user.user_metadata.organisation_id

  // Admin paths protection
  if (request.nextUrl.pathname.startsWith('/admin-dashboard')) {
    if (userRole !== 'admin' && userRole !== 'superadmin') {
      return NextResponse.redirect(new URL('/client-dashboard', request.url))
    }
  }

  // Client paths protection
  if (request.nextUrl.pathname.startsWith('/client-dashboard')) {
    if (!organisationId) {
      return NextResponse.redirect(new URL('/admin-dashboard', request.url))
    }
  }

  return response
}

// Enable middleware for dashboard routes only
export const config = {
  matcher: ['/client-dashboard/:path*', '/admin-dashboard/:path*'],
}
