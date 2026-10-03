import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check for NextAuth session cookies
  const sessionToken = request.cookies.get('authjs.session-token') ?? request.cookies.get('__Secure-authjs.session-token');
  
  const isPublicRoute = request.nextUrl.pathname.startsWith('/login') || 
                        request.nextUrl.pathname.startsWith('/api') || 
                        request.nextUrl.pathname.startsWith('/mobile-scan');

  if (!sessionToken && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next();
}

export const config = {
  // Protect all routes except /login, /api, /mobile-scan, and static Next.js assets
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|mobile-scan).*)"],
}
