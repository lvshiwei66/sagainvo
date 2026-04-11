// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { defaultLanguage, supportedLanguages, parseAcceptLanguage } from '@/i18n-config';
import { LANGUAGE_COOKIE_KEY } from '@/lib/i18n-storage';

export function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;

    // Skip middleware for API routes and static assets
    if (pathname.startsWith('/api/') || pathname.startsWith('/_next')) {
      return NextResponse.next();
    }

    const response = NextResponse.next();

    // Priority 1: Check existing cookie
    const cookieLang = request.cookies.get(LANGUAGE_COOKIE_KEY)?.value;
    if (cookieLang && supportedLanguages.includes(cookieLang)) {
      return response;
    }

    // Priority 2: Parse Accept-Language header
    const acceptLanguage = request.headers.get('accept-language');
    let currentLang = defaultLanguage;

    if (acceptLanguage) {
      currentLang = parseAcceptLanguage(acceptLanguage);
    }

    // Set the language cookie with detected language
    response.cookies.set(LANGUAGE_COOKIE_KEY, currentLang, {
      httpOnly: false, // Accessible by client-side JavaScript
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 31536000, // 1 year
    });

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
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