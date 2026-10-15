import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'
import { getDictionary, type Locale } from '../../../i18n/dictionaries'
import { fetchPostAlternates, fetchPostBySlug, type Post } from '../../../../../lib/api'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

function getSiteBase(): string {
  const site =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    'https://blog.expostep.com'
  return site.replace(/\/$/, '')
}

function toLocale(lang: string): Locale {
  return lang === 'tr' ? 'tr' : 'en'
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const locale = toLocale(lang)
  const site = getSiteBase()
  let post: Post | null = null
  try {
    post = await fetchPostBySlug(slug, locale)
  } catch {
    post = null
  }

  if (!post) {
    return {
      title: locale === 'tr' ? 'Yazı bulunamadı' : 'Post not found',
      robots: { index: false, follow: true },
    }
  }

  let alternates: { en: string | null; tr: string | null } = { en: null, tr: null }
  try {
    alternates = await fetchPostAlternates(post.id)
  } catch {
    // Keep nulls: page still renders, hreflang only covers the current slug.
  }
  const enSlug = alternates.en ?? (locale === 'en' ? slug : null)
  const trSlug = alternates.tr ?? (locale === 'tr' ? slug : null)

  const languages: Record<string, string> = {}
  if (enSlug) languages.en = `${site}/en/blog/${enSlug}`
  if (trSlug) languages.tr = `${site}/tr/blog/${trSlug}`
  languages['x-default'] = `${site}/en/blog/${enSlug ?? slug}`

  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: {
      canonical: `${site}/${locale}/blog/${slug}`,
      languages,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: 'article',
      url: `${site}/${locale}/blog/${slug}`,
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      alternateLocale: locale === 'tr' ? ['en_US'] : ['tr_TR'],
    },
  }
}

function formatDate(dateStr: string, locale: Locale) {
  const date = new Date(dateStr)
  return locale === 'tr'
    ? date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
    : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function renderNode(node: any, index: number): React.ReactNode {
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

function renderRichText(content: unknown): React.ReactNode {
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

function NotFound({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale)
  return (
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
  )
}

function PostArticle({ post, locale }: { post: Post; locale: Locale }) {
  const dict = getDictionary(locale)
  return (
    <article>
      {post.publishedDate && (
        <time className="text-sm text-muted-foreground">{formatDate(post.publishedDate, locale)}</time>
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
  )
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const locale = toLocale(lang)
  let post: Post | null = null
  try {
    post = await fetchPostBySlug(slug, locale)
  } catch {
    post = null
  }

  return (
    <div className="container mx-auto max-w-[800px] px-4 py-10 md:py-16">
      {!post ? <NotFound locale={locale} /> : <PostArticle post={post} locale={locale} />}
    </div>
  )
}
