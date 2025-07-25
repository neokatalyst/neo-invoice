// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  const pathname = request.nextUrl.pathname

  // Publicly accessible pages
  const publicPaths = ['/', '/signin', '/signup', '/forgot-password']
  const isPublic = publicPaths.some((path) => pathname.startsWith(path))

  if (!session || error) {
    // Redirect unauthenticated users trying to access protected pages
    if (!isPublic) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }
    return response
  }

  // Protect admin routes
  const role = session.user.user_metadata.role
  const org = session.user.user_metadata.organisation_id

  if (pathname.startsWith('/admin-dashboard')) {
    if (role !== 'admin' && role !== 'superadmin') {
      return NextResponse.redirect(new URL('/client-dashboard', request.url))
    }
  }

  if (pathname.startsWith('/client-dashboard')) {
    if (!org) {
      return NextResponse.redirect(new URL('/admin-dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/',
    '/signin',
    '/client-dashboard/:path*',
    '/admin-dashboard/:path*',
    '/capture',
    '/settings',
    '/dashboard',
  ],
}
