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

  const renderNode = (node: any, index: number): React.ReactNode => {
    if (!node) return null

    if (node.type === 'text') {
      let text: React.ReactNode = node.text || ''
      if (node.format) {
        if (node.format & 1) text = <strong key={index}>{text}</strong>
        if (node.format & 2) text = <em key={index}>{text}</em>
        if (node.format & 8) text = <code key={index} className="rounded bg-muted px-1.5 py-0.5 text-sm">{text}</code>
        if (node.format & 16) text = <u key={index}>{text}</u>
      }
      return text
    }

    const children = node.children?.map((child: any, i: number) => renderNode(child, i)) || []

    switch (node.type) {
      case 'paragraph':
        return <p key={index} className="mb-4 text-lg leading-relaxed">{children}</p>
      case 'heading':
        const Tag = (`h${node.level || 2}`) as keyof JSX.IntrinsicElements
        const headingClass = node.level === 1 ? 'text-4xl font-bold mt-8 mb-4' :
                            node.level === 2 ? 'text-3xl font-bold mt-8 mb-3' :
                            node.level === 3 ? 'text-2xl font-semibold mt-6 mb-2' :
                            'text-xl font-semibold mt-4 mb-2'
        return <Tag key={index} className={headingClass}>{children}</Tag>
      case 'list':
        if (node.listType === 'number') {
          return <ol key={index} className="mb-4 list-decimal list-inside space-y-1 text-lg">{children}</ol>
        }
        return <ul key={index} className="mb-4 list-disc list-inside space-y-1 text-lg">{children}</ul>
      case 'listitem':
        return <li key={index}>{children}</li>
      case 'quote':
        return <blockquote key={index} className="border-l-4 border-primary pl-4 italic my-6 text-lg text-muted-foreground">{children}</blockquote>
      case 'link':
        return (
          <a
            key={index}
            href={node.fields?.url || '#'}
            target={node.fields?.newTab ? '_blank' : undefined}
            rel={node.fields?.newTab ? 'noopener noreferrer' : undefined}
            className="text-primary underline hover:text-primary/80"
          >
            {children}
          </a>
        )
      case 'linebreak':
        return <br key={index} />
      default:
        return <div key={index}>{children}</div>
    }
  }

  const renderRichText = (content: unknown): React.ReactNode => {
    if (!content) return null
    if (typeof content === 'string') return <p className="whitespace-pre-wrap text-lg">{content}</p>
    if (typeof content === 'object' && content !== null) {
      const root = (content as any).root
      if (root && root.children && Array.isArray(root.children)) {
        return root.children.map((node: any, i: number) => renderNode(node, i))
      }
      // Fallback: try to render children directly
      if (Array.isArray((content as any).children)) {
        return (content as any).children.map((node: any, i: number) => renderNode(node, i))
      }
    }
    return null
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

          <div className="prose prose-lg max-w-none">
            {renderRichText(post.content)}
          </div>

          {post.author && (
            <p className="mt-8 text-sm text-muted-foreground">
              {locale === 'tr' ? 'Yazar' : 'Author'}: {post.author}
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
