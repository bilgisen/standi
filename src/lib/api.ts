import type { Locale } from '../app/(frontend)/i18n/dictionaries'

function getApiBase(): string {
  if (typeof window !== 'undefined') return '/api'
  const site =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    'https://blog.expostep.com'
  return `${site.replace(/\/$/, '')}/api`
}

const API_BASE = '/api'

function apiUrl(path: string): string {
  if (typeof window !== 'undefined') return `${API_BASE}${path}`
  return `${getApiBase()}${path}`
}

export interface Category {
  id: string
  title?: string
  slug?: string
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: unknown
  heroImage?: {
    id: string
    alt?: string
    url: string
    filename?: string
  }
  category?: Category | string
  tags?: Array<{ tag: string }>
  author?: string
  publishedDate?: string
  _status?: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}

export interface PaginatedResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
}

export async function fetchPosts(
  locale: Locale = 'en',
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Post>> {
  const params = new URLSearchParams({
    locale,
    depth: '1',
    page: String(page),
    limit: String(limit),
    'where[_status][equals]': 'published',
    sort: '-publishedDate',
  })

  const res = await fetch(apiUrl(`/posts?${params}`))
  if (!res.ok) {
    throw new Error(`Failed to fetch posts: ${res.statusText}`)
  }
  return res.json()
}

export async function fetchPostBySlug(
  slug: string,
  locale: Locale = 'en',
): Promise<Post | null> {
  // Strict locale match: the slug must belong to the requested locale.
  // Cross-locale fallback was removed because it rendered the wrong language
  // under the wrong URL (duplicate content, broken hreflang).
  const params = new URLSearchParams({
    locale,
    depth: '1',
    'where[slug][equals]': slug,
    limit: '1',
  })

  const res = await fetch(apiUrl(`/posts?${params}`))
  if (!res.ok) {
    throw new Error(`Failed to fetch post: ${res.statusText}`)
  }
  const data = await res.json()
  const doc = data.docs?.[0]
  if (!doc || doc._status !== 'published') return null
  return doc
}

/**
 * Slugs of the same document in both locales (same Payload id).
 * Used for hreflang alternates + canonical metadata.
 */
export async function fetchPostAlternates(
  id: string,
): Promise<{ en: string | null; tr: string | null }> {
  const [en, tr] = await Promise.all([
    fetchDocSlugById('posts', id, 'en'),
    fetchDocSlugById('posts', id, 'tr'),
  ])
  return { en, tr }
}

export async function fetchCategories(locale: Locale = 'en'): Promise<Category[]> {
  const params = new URLSearchParams({
    locale,
    depth: '0',
    limit: '100',
    sort: 'title',
  })

  const res = await fetch(apiUrl(`/categories?${params}`))
  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.statusText}`)
  }
  const data = await res.json()
  return data.docs
}

export async function fetchPostsByCategory(
  slug: string,
  locale: Locale = 'en',
  limit: number = 20
): Promise<{ category: Category | null; posts: Post[] }> {
  const catParams = new URLSearchParams({
    locale,
    depth: '0',
    'where[slug][equals]': slug,
    limit: '1',
  })

  const catRes = await fetch(apiUrl(`/categories?${catParams}`))
  const catData = await catRes.json()
  const category: Category | null = catData.docs[0] || null

  if (!category) {
    return { category: null, posts: [] }
  }

  const postParams = new URLSearchParams({
    locale,
    depth: '1',
    limit: String(limit),
    'where[and][0][_status][equals]': 'published',
    'where[and][1][category][equals]': category.id,
    sort: '-publishedDate',
  })

  const postRes = await fetch(apiUrl(`/posts?${postParams}`))
  const postData = await postRes.json()
  return { category, posts: postData.docs }
}

/**
 * Resolve a document by its slug in a given locale. Used by the language
 * switcher to map a URL from one locale to the equivalent slug in another.
 */
export async function fetchDocBySlug(
  collection: 'posts' | 'categories',
  slug: string,
  locale: Locale = 'en'
): Promise<{ id: string; slug?: string } | null> {
  const params = new URLSearchParams({
    locale,
    depth: '0',
    limit: '1',
    'where[slug][equals]': slug,
  })

  const res = await fetch(apiUrl(`/${collection}?${params}`))
  if (!res.ok) return null
  const data = await res.json()
  return (data.docs && data.docs[0]) || null
}

/**
 * Get the localized slug for a document id in the target locale.
 */
export async function fetchDocSlugById(
  collection: 'posts' | 'categories',
  id: string,
  locale: Locale = 'en'
): Promise<string | null> {
  const res = await fetch(apiUrl(`/${collection}/${id}?locale=${locale}&depth=0`))
  if (!res.ok) return null
  const data = await res.json()
  return data.slug ?? null
}

