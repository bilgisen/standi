'use client'

import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { fetchPosts, type Post } from '../../../lib/api'
import { type Locale } from '../i18n/dictionaries'
import { getDictionary } from '../i18n/dictionaries'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Badge } from '@/components/ui/badge'

export function HeroCarousel({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await fetchPosts(locale, 1, 5)
        if (!cancelled) setPosts(data.docs)
      } catch {
        // ignore; carousel stays empty
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [locale])

  if (loading) {
    return (
      <div className="h-[420px] w-full animate-pulse bg-muted md:h-[520px]" aria-hidden="true" />
    )
  }

  if (posts.length === 0) {
    return null
  }

  return (
    <Carousel
      className="overflow-hidden rounded-xl shadow-sm"
      opts={{ loop: true, align: 'start' }}
    >
              <CarouselContent className="-ml-0">
                {posts.map((post) => (
                  <CarouselItem key={post.id} className="pl-0">
                    <a href={`/${locale}/blog/${post.slug}`} className="group relative block h-[420px] w-full overflow-hidden md:h-[520px]">
                      {post.heroImage?.url ? (
                        <img
                          src={post.heroImage.url}
                          alt={post.heroImage.alt || post.heroImage.filename || post.title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-muted" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                        {typeof post.category === 'object' && post.category?.slug && (
                          <Badge
                            className="mb-3 bg-primary/90 text-primary-foreground hover:bg-primary/90"
                            asChild
                          >
                            <a href={`/${locale}/category/${post.category.slug}`}>{post.category.title}</a>
                          </Badge>
                        )}
                        <h2 className="text-2xl font-bold leading-tight tracking-tight text-white md:text-4xl">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="mt-3 hidden max-w-2xl text-sm text-white/80 line-clamp-2 md:block">
                            {post.excerpt}
                          </p>
                        )}
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white/90 transition-colors group-hover:text-white">
                          {dict.blog.readMore}
                          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                        </span>
                      </div>
                    </a>
                  </CarouselItem>
                ))}
              </CarouselContent>
      <CarouselPrevious className="left-4 bg-background/60 text-foreground backdrop-blur-sm hover:bg-background/80" />
      <CarouselNext className="right-4 bg-background/60 text-foreground backdrop-blur-sm hover:bg-background/80" />
    </Carousel>
  )
}
