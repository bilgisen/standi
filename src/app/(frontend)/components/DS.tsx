"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Forward, Play } from "lucide-react"
import * as React from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { useLocale } from "../components/LocaleProvider"
import { getDictionary } from "../i18n/dictionaries"
import { FadeInOnScroll } from "@/components/ui/fade-in-on-scroll"

interface SliderProps {
  id: number
  images: string[]
  className?: string
}

function Slider({ id, images, className }: SliderProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  const [isHovered, setIsHovered] = React.useState(false)
  const intervalRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  React.useEffect(() => {
    if (isHovered) {
      intervalRef.current = window.setInterval(() => {
        if (!api) return
        const nextIndex = (current % count) || 0
        api.scrollTo(nextIndex)
      }, 2000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isHovered, current, count, api])

  return (
    <div
      className={cn("w-full", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }}
    >
      <Carousel setApi={setApi} className="w-full group" opts={{ loop: true }}>
        <CarouselContent>
          {images.map((image, index) => {
            if (!image || typeof image !== "string" || !image.trim()) return null
            const imageUrl = image.startsWith("/")
              ? `https://res.cloudinary.com/daa8dnuhr/image/upload/f_auto,q_auto:best,w_1200${image}`
              : image
            return (
              <CarouselItem key={index}>
                <div className="aspect-[3/2] relative w-full">
                  <Image
                    src={imageUrl}
                    alt={`Slider ${id} Image ${index + 1}`}
                    fill
                    className="object-cover rounded-sm transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1200px"
                    quality={90}
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>
      <div className="mt-2 flex items-center justify-center gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              api?.scrollTo(index)
              setCurrent(index + 1)
            }}
            className={cn("h-2 w-2 rounded-full transition-colors", {
              "bg-primary": current === index + 1,
              "bg-muted/50": current !== index + 1,
            })}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

interface SliderData {
  id: number
  images: string[]
}

type VideoPlatform = "youtube" | "vimeo"

interface VideoDialogProps {
  platform: VideoPlatform
  videoId: string
  thumbnailSrc: string
  thumbnailAlt?: string
  className?: string
}

function getVideoSrc(platform: VideoPlatform, id: string) {
  if (platform === "youtube") {
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
  }
  return `https://player.vimeo.com/video/${id}?autoplay=1&muted=0`
}

function VideoDialog({
  platform,
  videoId,
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
  className,
}: VideoDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "group relative block w-full h-full overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            className
          )}
        >
          <div className="relative w-full h-0 pb-[56.25%] bg-muted/20">
            <Image
              src={thumbnailSrc}
              alt={thumbnailAlt}
              fill
              className="object-cover transition-all duration-200 ease-out group-hover:brightness-90"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center justify-center">
                <div className="bg-primary/80 backdrop-blur-sm rounded-full p-3 text-white transition-transform duration-200 group-hover:scale-110">
                  <Play className="h-6 w-6 md:h-8 md:w-8 fill-current" />
                </div>
              </div>
            </div>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="aspect-video w-full">
          <iframe
            src={getVideoSrc(platform, videoId)}
            title="Video player"
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function DS() {
  const locale = useLocale()
  const dict = getDictionary(locale)

  const sliders: SliderData[] = [
    { id: 1, images: ["/ds_1-1_tehlt5.jpg", "/ds_1-2_bzik7o.jpg", "/ds_1-3_c3qkqr.jpg"] },
    { id: 2, images: ["/ds_2-1_vbnijv.jpg", "/ds_2-2_exjbkx.jpg", "/ds_2-3_jgabzw.jpg"] },
    { id: 3, images: ["/ds_3-1_xnaarp.jpg", "/ds_3-2_krz1sb.jpg", "/ds_3-3_n2wd57.jpg"] },
    { id: 4, images: ["/ds_4-1_koew26.jpg", "/ds_4-2_q72ujm.jpg", "/ds_4-3_ublivy.jpg"] },
    { id: 5, images: ["/ds_5-1_lsrulo.jpg", "/ds_5-2_uwg09p.jpg", "/ds_5-3_wvgnbc.jpg"] },
  ]

  return (
    <FadeInOnScroll duration={0.8} yOffset={40} className="w-full">
      <section className="py-12 md:py-6 lg:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <h3 className="text-2xl uppercase text-center mb-2 text-primary/80">
            {dict.ds.sectionLabel}
          </h3>
          <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold tracking-tight text-center mb-12">
            {dict.ds.sectionTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Slider {...sliders[0]} className="w-full" />
            <Slider {...sliders[1]} className="w-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {sliders.slice(2).map((slider) => (
              <Slider key={slider.id} {...slider} className="w-full" />
            ))}
          </div>
          <div className="w-full flex justify-center pt-8">
            <Link href={`/${locale}/design`}>
              <Button className="px-8 py-6 text-lg flex items-center gap-2" size="lg" variant="outline">
                {dict.ds.cta} <Forward className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </FadeInOnScroll>
  )
}
