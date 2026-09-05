"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Forward } from "lucide-react"
import * as React from "react"
import Link from "next/link"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
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

export default function PM() {
  const locale = useLocale()
  const dict = getDictionary(locale)

  const sliders: SliderData[] = [
    { id: 1, images: ["/pm_c1-1-1_ffmzwy.jpg", "/pm_c1-1-2_kslfj4.jpg", "/pm_c1-1-3_xvqu0h.jpg"] },
    { id: 2, images: ["/pm_c1-2-3_q5t2ed.jpg", "/pm_c1-2-2_ue5gmr.jpg", "/pm_c1-2-3_q5t2ed.jpg"] },
    { id: 3, images: ["/pm_c1-3-1_rmnb39.jpg", "/pm_c1-3-2_kqzsje.jpg", "/pm_c1-3-3_bjoc7a.jpg"] },
    { id: 4, images: ["/pm_c1-4-1_yzukdv.jpg", "/pm_c1-4-2_yv8aga.jpg", "/pm_c1-4-3_tbvqak.jpg"] },
    { id: 5, images: ["/pm_c1-5-1_tsxoow.jpg", "/pm_c1-5-2_ww0gwb.jpg", "/pm_c1-5-3_ifphl0.jpg"] },
  ]

  return (
    <FadeInOnScroll duration={0.8} yOffset={40} className="w-full">
      <section className="py-12 md:py-6 lg:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <h3 className="text-2xl uppercase text-center mb-2 text-primary/80">
            {dict.pm.sectionLabel}
          </h3>
          <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold tracking-tight text-center mb-12">
            {dict.pm.sectionTitle}
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
          <div className="w-full flex justify-center mt-12">
            <Link href={`/${locale}/project`}>
              <Button className="px-8 py-6 text-lg flex items-center gap-2" size="lg" variant="outline">
                {dict.pm.cta} <Forward className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </FadeInOnScroll>
  )
}
