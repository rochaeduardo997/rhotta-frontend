import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COOKIE_TOKEN_KEY } from './@shared/constants/cookie-token.contants';

const PUBLIC_PATHS = ['/auth/login', '/auth/signup'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_TOKEN_KEY)?.value;
  const { pathname } = request.nextUrl;

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/companies', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logos|backgrounds).*)']
};
