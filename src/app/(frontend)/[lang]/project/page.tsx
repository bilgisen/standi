"use client"

import Image from "next/image"
import * as React from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { SubPageHero } from "../../components/SubPageHero"

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
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isHovered, current, count, api])

  return (
    <div
      className={cn("max-w-6xl mx-auto", className)}
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

const sliders: SliderData[] = [
  { id: 1, images: ["/pm_c1-1-1_ffmzwy.jpg", "/pm_c1-1-2_kslfj4.jpg", "/pm_c1-1-3_xvqu0h.jpg"] },
  { id: 2, images: ["/pm_c1-2-3_q5t2ed.jpg", "/pm_c1-2-2_ue5gmr.jpg", "/pm_c1-2-3_q5t2ed.jpg"] },
  { id: 3, images: ["/pm_c1-3-1_rmnb39.jpg", "/pm_c1-3-2_kqzsje.jpg", "/pm_c1-3-3_bjoc7a.jpg"] },
  { id: 4, images: ["/pm_c1-4-1_yzukdv.jpg", "/pm_c1-4-2_yv8aga.jpg", "/pm_c1-4-3_tbvqak.jpg"] },
  { id: 5, images: ["/pm_c1-5-1_tsxoow.jpg", "/pm_c1-5-2_ww0gwb.jpg", "/pm_c1-5-3_ifphl0.jpg"] },
  { id: 6, images: ["/aselkon-pm_lcn459.jpg", "/aselkon-pm_3_nfupwu.jpg", "/aselkon-pm_2_ktuy7n.jpg"] },
  { id: 7, images: ["/sarsilmaz-1_eathtp.jpg", "/sarsilmaz-2_osotzj.jpg", "/sarsilmaz-3_xmngqa.jpg"] },
  { id: 8, images: ["/koluman-1_gxintl.jpg", "/koluman-2_hjsdrv.jpg", "/koluman-3_beahwu.jpg"] },
  { id: 9, images: ["/rosatom-3_c7v7rk.jpg", "/rosatom-1_vqvwqm.jpg", "/rosatom-2_abr1lp.jpg"] },
  { id: 10, images: ["/bykepi1_gupxgs.jpg", "/bykepi-2_hzrdsx.jpg", "/bykepi-3_wi7msx.jpg"] },
]

export default function ProjectPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SubPageHero heroKey="projects" />
      <section className="py-12 md:py-6 lg:py-12">
        <div className="container mx-auto p-2 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sliders.map((slider, index) => (
              <motion.div
                key={slider.id}
                className="w-full"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.2,
                  ease: "easeOut",
                }}
                viewport={{ once: true }}
              >
                <Slider {...slider} className="w-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
