// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { defaultLanguage } from '@/i18n-config';

export function middleware(request: NextRequest) {
  // Get the preferred language from the cookie, header, or fallback to default
  const pathname = request.nextUrl.pathname;

  // Skip middleware for API routes and static assets
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // For now, simply ensure the request has a language cookie
  // In a more advanced setup, we could parse Accept-Language headers
  const response = NextResponse.next();
  const currentLang = request.cookies.get('NEXT_LOCALE')?.value || defaultLanguage;

  // Set the language cookie if it doesn't exist
  if (!request.cookies.get('NEXT_LOCALE')) {
    response.cookies.set('NEXT_LOCALE', currentLang);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};