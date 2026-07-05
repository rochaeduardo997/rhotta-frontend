import { COOKIE_TOKEN_KEY } from '@src/@shared/constants/cookie-token.contants';
import { type NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/auth/signup', 'auth/login', '/auth/login/forgot-password'];
export default function authMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_ROUTES.includes(pathname)) return NextResponse.next();
  const token = req.cookies.get(COOKIE_TOKEN_KEY)?.value;
  if (!token) return NextResponse.redirect(new URL('/sign-in', process.env.NEXT_PUBLIC_AUTH_APP_URL ?? req.url));
  return NextResponse.next();
}
