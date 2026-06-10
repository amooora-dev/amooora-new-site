import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin/login')) {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    if (token) {
      const session = await verifySessionToken(token);
      if (session) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    const session = await verifySessionToken(token);
    if (!session) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.set(ADMIN_SESSION_COOKIE, '', { maxAge: 0, path: '/' });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
