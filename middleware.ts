import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n } from './i18n-config'
import { updateSession } from '@/utils/supabase/middleware'


export async function middleware(request: NextRequest) {
  // Update the Supabase auth session
  const response = await updateSession(request)

  const pathname = request.nextUrl.pathname
  const searchParams = request.nextUrl.searchParams
  const queryString = searchParams.toString()

  // Check if the pathname already has a locale
  const pathnameHasLocale = i18n.locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return response || NextResponse.next()

  // Redirect if at the root
  if (pathname === '/') {
    // Always redirect to Hebrew for the root path
    const destination = queryString ? `/he?${queryString}` : '/he'
    return NextResponse.redirect(new URL(destination, request.url))
  }

  // For all other paths without locale, add the 'he' prefix
  const destination = queryString ? `/he${pathname}?${queryString}` : `/he${pathname}`
  return NextResponse.redirect(new URL(destination, request.url))
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
