import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const LOCALES = ['en', 'tr'] as const
type Locale = (typeof LOCALES)[number]

function detectLocale(req: NextRequest): Locale {
  const accept = req.headers.get('accept-language') || ''
  const preferred = accept
    .split(',')
    .map((part) => part.split(';')[0].trim().toLowerCase())
  for (const lang of preferred) {
    if (lang.startsWith('tr')) return 'tr'
  }
  return 'en'
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Pass through API, admin panel, Next internals and static assets.
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  const first = pathname.split('/')[1]

  // Already localized → pass through.
  if (first === 'en' || first === 'tr') {
    return NextResponse.next()
  }

  const locale = detectLocale(req)
  const target = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(new URL(target, req.url))
}

export const config = {
  // Run on everything except payload API/assets and Next internals.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)'],
}
