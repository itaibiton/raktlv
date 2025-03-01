import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

// Get your configured locales from your i18n config
// Replace this with your actual import if different
import { i18n } from './i18n-config'

function getLocale(request: NextRequest): string {
  // Default locale is Hebrew
  const defaultLocale = 'he'

  // Get accepted languages from the headers
  const headers = new Headers(request.headers)
  const acceptLanguage = headers.get('accept-language') || ''

  // Create a negotiator instance
  const negotiatorHeaders = { 'accept-language': acceptLanguage }
  const locales = i18n.locales || ['he', 'en']

  // Use negotiator and intl-localematcher to get the best locale
  let languages: string[] = []
  try {
    const negotiator = new Negotiator({ headers: negotiatorHeaders })
    languages = negotiator.languages()
  } catch (e) {
    // Fallback if negotiator fails
    languages = [defaultLocale]
  }

  try {
    return match(languages, locales, defaultLocale)
  } catch (e) {
    return defaultLocale
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if the pathname already has a locale
  const pathnameHasLocale = i18n.locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return NextResponse.next()

  // Redirect if at the root
  if (pathname === '/') {
    // Always redirect to Hebrew for the root path
    return NextResponse.redirect(new URL(`/he`, request.url))
  }

  // For all other paths without locale, add the 'he' prefix
  return NextResponse.redirect(new URL(`/he${pathname}`, request.url))
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
