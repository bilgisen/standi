'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { fetchDocBySlug, fetchDocSlugById } from '../../../lib/api'
import { useLocale } from './LocaleProvider'

const OTHER: Record<'en' | 'tr', 'en' | 'tr'> = { en: 'tr', tr: 'en' }

const LABELS: Record<'en' | 'tr', string> = { en: 'EN', tr: 'TR' }

/**
 * Single language toggle. It shows only the *other* (passive) language and,
 * on click, navigates to the equivalent localized URL:
 *   /en/blog/infa-2026  ->  /tr/blog/infa-hannover-fuari-rehberi
 * On structural routes (home, blog list, about) it just swaps the locale prefix.
 */
export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname() || `/${locale}`
  const [switching, setSwitching] = useState(false)
  const target = OTHER[locale]

  const resolveTargetPath = async (): Promise<string> => {
    const segments = pathname.split('/').filter(Boolean) // e.g. ['en','blog','infa-2026']
    const segLang = segments[0]
    const rest = segments.slice(1)
    const base = `/${target}`

    // Detail routes carry a slug that differs per locale.
    if (rest[0] === 'blog' && rest[1]) {
      const doc = await fetchDocBySlug('posts', rest[1], locale)
      if (doc?.id) {
        const trSlug = await fetchDocSlugById('posts', doc.id, target)
        if (trSlug) return `${base}/blog/${trSlug}`
      }
      return `${base}/blog`
    }
    if (rest[0] === 'category' && rest[1]) {
      const doc = await fetchDocBySlug('categories', rest[1], locale)
      if (doc?.id) {
        const trSlug = await fetchDocSlugById('categories', doc.id, target)
        if (trSlug) return `${base}/category/${trSlug}`
      }
      return `${base}/category`
    }

    // Structural routes: swap the locale prefix, keep the rest.
    if (segLang === 'en' || segLang === 'tr') {
      return `/${target}/${rest.join('/')}`.replace(/\/$/, '') || `/${target}`
    }
    return `${base}/${rest.join('/')}`.replace(/\/$/, '') || base
  }

  const handleClick = async () => {
    setSwitching(true)
    try {
      const next = await resolveTargetPath()
      window.location.href = next
    } catch {
      window.location.href = `/${target}`
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={switching}
      className="px-2 py-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
      aria-label={locale === 'tr' ? 'İngilizceye geç' : 'Switch to Turkish'}
    >
      {LABELS[target]}
    </button>
  )
}
