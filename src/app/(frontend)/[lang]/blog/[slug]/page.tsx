'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import { ArrowLeft } from 'lucide-react'
import { getDictionary, type Locale } from '../../../i18n/dictionaries'
import { useLocale } from '../../../components/LocaleProvider'
import { fetchPostBySlug, type Post } from '../../../../../lib/api'
import { Button } from '@/components/ui/button'

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const locale = useLocale()
  const dict = getDictionary(locale)
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPost() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchPostBySlug(slug, locale)
        setPost(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post')
      } finally {
        setLoading(false)
      }
    }
    loadPost()
  }, [slug, locale])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return locale === 'tr'
      ? date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
      : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const renderRichText = (content: unknown): string => {
    if (!content) return ''
    if (typeof content === 'string') return content
    if (typeof content === 'object' && content !== null && 'root' in content) {
      const root = (content as { root: { children?: Array<{ children?: Array<{ text?: string }> }> } }).root
      if (root.children) {
        return root.children
          .map((node) => node.children?.map((child) => child.text || '').join('') || '')
          .join('\n')
      }
    }
    return ''
  }

  return (
    <div className="container mx-auto max-w-[800px] px-4 py-10 md:py-16">
      {loading && (
        <div className="py-16 text-center text-muted-foreground">{dict.blog.loading}</div>
      )}

      {error && (
        <div className="py-16 text-center">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {!loading && !error && !post && (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <h1 className="text-3xl font-bold">{dict.blog.notFound}</h1>
          <p className="text-muted-foreground">{dict.blog.notFoundBody}</p>
          <Button asChild variant="outline">
            <a href={`/${locale}/blog`}>
              <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
              {dict.blog.back}
            </a>
          </Button>
        </div>
      )}

      {!loading && !error && post && (
        <article>
          {post.publishedDate && (
            <time className="text-sm text-muted-foreground">{formatDate(post.publishedDate)}</time>
          )}
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">{post.title}</h1>

          {post.heroImage?.url && (
            <img
              src={post.heroImage.url}
              alt={post.heroImage.alt || post.heroImage.filename || post.slug}
              className="my-8 w-full rounded-lg object-cover"
            />
          )}

          {post.excerpt && (
            <p className="mb-6 text-lg italic text-muted-foreground">{post.excerpt}</p>
          )}

          <p className="whitespace-pre-wrap text-lg text-muted-foreground">
            {renderRichText(post.content)}
          </p>

          {post.author && (
            <p className="mt-8 text-sm text-muted-foreground">
              {dict.common.author}: {post.author}
            </p>
          )}

          <div className="mt-10">
            <Button asChild variant="ghost" size="sm" className="px-0 text-muted-foreground hover:text-primary">
              <a href={`/${locale}/blog`}>
                <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
                {dict.blog.back}
              </a>
            </Button>
          </div>
        </article>
      )}
    </div>
  )
}
