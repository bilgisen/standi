import type { Locale } from '../i18n/dictionaries'

/**
 * Prefix a route with the active locale, e.g. withLang('tr', '/blog/x') → '/tr/blog/x'.
 * The `path` may omit or include a leading slash; the result always has one.
 */
export function withLang(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  return `/${locale}${clean === '/' ? '' : clean}`
}

/**
 * Swap the leading locale segment of a pathname to the other locale, keeping the
 * rest of the path intact. Used by the language switcher for structural routes
 * (home, blog list, about) where there is no per-locale slug to resolve.
 */
export function swapLangPrefix(pathname: string, target: Locale): string {
  const segments = pathname.split('/')
  // segments[0] === '' (leading slash), segments[1] === locale or first path part
  if (segments[1] === 'en' || segments[1] === 'tr') {
    segments[1] = target
  } else {
    segments.splice(1, 0, target)
  }
  return segments.join('/') || `/${target}`
}
