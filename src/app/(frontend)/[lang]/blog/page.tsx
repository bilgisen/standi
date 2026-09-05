'use client'

import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { getDictionary, type Locale } from '../../i18n/dictionaries'
import { useLocale } from '../../components/LocaleProvider'
import { fetchPosts, type Post } from '../../../../lib/api'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function BlogPage() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPosts() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchPosts(locale)
        setPosts(data.docs)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts')
      } finally {
        setLoading(false)
      }
    }
    loadPosts()
  }, [locale])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return locale === 'tr'
      ? date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
      : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-10 md:px-6 md:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{dict.blog.title}</h1>
        <p className="mt-3 text-muted-foreground">{dict.blog.subtitle}</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          {dict.blog.loading}
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center py-16">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <p className="text-muted-foreground">{dict.blog.empty}</p>
          <Button asChild variant="outline">
            <a href="/admin">
              {dict.blog.create}
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </a>
          </Button>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
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
                {typeof post.category === 'object' && post.category?.slug && (
                  <Badge variant="secondary" asChild className="w-fit">
                    <a href={`/${locale}/category/${post.category.slug}`}>{post.category.title}</a>
                  </Badge>
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
    </div>
  )
}
