'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getDictionary, type Locale } from '../../../i18n/dictionaries'
import { useLocale } from '../../../components/LocaleProvider'
import { fetchPostsByCategory } from '../../../../../lib/api'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const locale = useLocale()
  const dict = getDictionary(locale)
  const [data, setData] = useState<{ category: { title?: string; description?: string; slug?: string } | null; posts: Array<any> } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const result = await fetchPostsByCategory(slug, locale)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load category')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug, locale])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return locale === 'tr'
      ? date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
      : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-10 md:px-6 md:py-16">
      <Button asChild variant="ghost" size="sm" className="mb-6 px-0 text-muted-foreground hover:text-primary">
        <a href={`/${locale}/blog`}>
          <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
          {dict.category.back}
        </a>
      </Button>

      {loading && (
        <div className="py-16 text-center text-muted-foreground">{dict.category.loading}</div>
      )}

      {error && (
        <div className="py-16 text-center">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {!loading && !error && !data?.category && (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <h1 className="text-2xl font-bold">{dict.category.notFound}</h1>
          <p className="text-muted-foreground">{dict.category.notFoundBody}</p>
        </div>
      )}

      {!loading && !error && data?.category && (
        <>
          <header className="mb-10">
            <Badge variant="outline" className="mb-4">
              {dict.category.label}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
              {data.category.title}
            </h1>
            {data.category.description && (
              <p className="mt-3 max-w-2xl text-muted-foreground">
                {data.category.description}
              </p>
            )}
          </header>

          {data.posts.length === 0 ? (
            <p className="py-8 text-muted-foreground">{dict.category.empty}</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.posts.map((post) => (
                <Card key={post.id} className="overflow-hidden rounded-lg">
                  {post.heroImage?.url ? (
                    <img
                      src={post.heroImage.url}
                      alt={post.heroImage.alt || post.heroImage.filename || post.title}
                      className="aspect-video w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-video w-full bg-muted" />
                  )}
                  <CardHeader>
                    {post.publishedDate && (
                      <time className="text-sm text-muted-foreground">{formatDate(post.publishedDate)}</time>
                    )}
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    {post.excerpt && (
                      <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="ghost" size="sm" className="px-0 text-primary">
                      <a href={`/${locale}/blog/${post.slug}`}>
                        {dict.blog.readMore}
                        <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
